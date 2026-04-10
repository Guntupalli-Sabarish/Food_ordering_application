package com.foodapp.repository;

import com.foodapp.model.Restaurant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

	Optional<Restaurant> findByNameIgnoreCase(String name);
}
