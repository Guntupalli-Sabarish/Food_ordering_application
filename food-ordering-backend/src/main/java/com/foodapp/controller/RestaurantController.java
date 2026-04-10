package com.foodapp.controller;

import com.foodapp.dto.response.ApiResponse;
import com.foodapp.dto.response.MenuItemResponse;
import com.foodapp.dto.response.RestaurantResponse;
import com.foodapp.service.MenuService;
import com.foodapp.service.RestaurantService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getAllRestaurants()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getById(id)));
    }

    @GetMapping("/{id}/menu")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenu(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(menuService.getMenuByRestaurant(id)));
    }
}
