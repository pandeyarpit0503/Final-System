package com.tastetrack.repository;

import com.tastetrack.entity.Order;
import com.tastetrack.entity.Order.OrderStatus;
import com.tastetrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    
    List<Order> findByStatus(OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.user = :user AND o.status IN :statuses")
    List<Order> findByUserAndStatusIn(User user, List<OrderStatus> statuses);
    
    Optional<Order> findByOrderNumber(String orderNumber);
}
