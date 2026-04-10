package com.foodapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantResponse {

    private Long id;
    private String name;
    private String address;
    private String cuisineType;
    private String imageUrl;
}
