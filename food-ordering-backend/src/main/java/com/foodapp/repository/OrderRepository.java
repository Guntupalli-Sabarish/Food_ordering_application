package com.foodapp.repository;

import com.foodapp.model.Order;
import com.foodapp.model.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);
}
