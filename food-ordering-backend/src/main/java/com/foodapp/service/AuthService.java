package com.foodapp.service;

import com.foodapp.dto.request.LoginRequest;
import com.foodapp.dto.request.GoogleAuthRequest;
import com.foodapp.dto.request.RegisterRequest;
import com.foodapp.dto.response.ApiResponse;
import com.foodapp.dto.response.AuthResponse;
import com.foodapp.exception.UnauthorizedException;
import com.foodapp.exception.ValidationException;
import com.foodapp.model.User;
import com.foodapp.model.enums.Role;
import com.foodapp.repository.UserRepository;
import com.foodapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final GoogleTokenVerifierService googleTokenVerifierService;

    public ApiResponse<AuthResponse> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);
        emailService.sendRegistrationEmail(user.getEmail(), user.getName());

        log.info("[Auth] New user registered: {}", user.getEmail());
        return ApiResponse.success(new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getName(), user.getEmail()));
    }

    public ApiResponse<AuthResponse> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        log.info("[Auth] User logged in: {}", user.getEmail());
        return ApiResponse.success(new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getName(), user.getEmail()));
    }

    public ApiResponse<AuthResponse> googleLogin(GoogleAuthRequest request) {
        GoogleTokenVerifierService.GoogleUserProfile profile = googleTokenVerifierService.verify(request.getIdToken());

        User user = userRepository.findByEmail(profile.email())
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setName(profile.name());
                newUser.setEmail(profile.email());
                // OAuth users still require a non-empty stored password for UserDetails mapping.
                newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                newUser.setRole(Role.USER);
                return userRepository.save(newUser);
            });

        if (user.getName() == null || user.getName().isBlank()) {
            user.setName(profile.name());
            userRepository.save(user);
        }

        log.info("[Auth] User logged in with Google: {}", user.getEmail());
        return ApiResponse.success(new AuthResponse(jwtUtil.generateToken(user.getEmail()), user.getName(), user.getEmail()));
    }
}
