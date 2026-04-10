package com.foodapp.service;

import com.foodapp.dto.response.RestaurantResponse;
import com.foodapp.exception.ResourceNotFoundException;
import com.foodapp.model.Restaurant;
import com.foodapp.repository.RestaurantRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
            .map(this::mapToRestaurantResponse)
            .toList();
    }

    public RestaurantResponse getById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return mapToRestaurantResponse(restaurant);
    }

    private RestaurantResponse mapToRestaurantResponse(Restaurant restaurant) {
        return new RestaurantResponse(
            restaurant.getId(),
            restaurant.getName(),
            restaurant.getAddress(),
            restaurant.getCuisineType(),
            restaurant.getImageUrl());
    }
}
