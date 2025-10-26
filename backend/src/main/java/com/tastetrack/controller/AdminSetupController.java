package com.tastetrack.controller;

import com.tastetrack.entity.User;
import com.tastetrack.entity.Restaurant;
import com.tastetrack.entity.MenuItem;
import com.tastetrack.repository.UserRepository;
import com.tastetrack.repository.RestaurantRepository;
import com.tastetrack.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin-setup")
@CrossOrigin(origins = "*")
public class AdminSetupController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private EntityManager entityManager;
    
    @GetMapping("/create-admin")
    public ResponseEntity<Map<String, String>> createAdmin() {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Check if admin already exists
            Optional<User> existingAdmin = userRepository.findByEmail("admin@tastetrack.com");
            
            User admin;
            if (existingAdmin.isPresent()) {
                admin = existingAdmin.get();
                response.put("message", "Admin user already exists, updating password");
            } else {
                admin = new User();
                admin.setEmail("admin@tastetrack.com");
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setPhone("+1 (555) 000-0000");
                admin.setRole(User.Role.ADMIN);
                admin.setEnabled(true);
                response.put("message", "Admin user created successfully");
            }
            
            // Set/update password
            String plainPassword = "password";
            String hashedPassword = passwordEncoder.encode(plainPassword);
            admin.setPassword(hashedPassword);
            
            userRepository.save(admin);
            
            response.put("email", "admin@tastetrack.com");
            response.put("password", plainPassword);
            response.put("passwordHash", hashedPassword);
            response.put("role", admin.getRole().name());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/test-password")
    public ResponseEntity<Map<String, Object>> testPassword(
            @RequestParam String email,
            @RequestParam String password) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                response.put("found", false);
                response.put("message", "User not found");
                return ResponseEntity.ok(response);
            }
            
            User user = userOpt.get();
            response.put("found", true);
            response.put("email", user.getEmail());
            response.put("role", user.getRole().name());
            response.put("enabled", user.isEnabled());
            response.put("storedPasswordHash", user.getPassword());
            
            boolean matches = passwordEncoder.matches(password, user.getPassword());
            response.put("passwordMatches", matches);
            
            // Also test encoding the provided password
            String newHash = passwordEncoder.encode(password);
            response.put("newHashForSamePassword", newHash);
            response.put("newHashMatches", passwordEncoder.matches(password, newHash));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/refresh-menu-data")
    @Transactional
    public ResponseEntity<Map<String, Object>> refreshMenuData() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Delete all existing menu items and restaurants
            menuItemRepository.deleteAll();
            restaurantRepository.deleteAll();

            // Reset auto-increment counters
            entityManager.createNativeQuery("ALTER TABLE restaurants AUTO_INCREMENT = 1").executeUpdate();
            entityManager.createNativeQuery("ALTER TABLE menu_items AUTO_INCREMENT = 1").executeUpdate();
            entityManager.flush();

            // Create restaurants with new images
            List<Restaurant> restaurants = new ArrayList<>();

            Restaurant luigi = new Restaurant();
            luigi.setName("Luigi's Italian Kitchen");
            luigi.setCuisine("Italian");
            luigi.setRating(4.5);
            luigi.setDeliveryTime("25-35 min");
            luigi.setMinOrder(15.00);
            luigi.setImage("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop");
            luigi.setAddress("123 Main St, Downtown");
            luigi.setIsOpen(true);
            restaurants.add(luigi);

            Restaurant tokyo = new Restaurant();
            tokyo.setName("Tokyo Sushi Bar");
            tokyo.setCuisine("Japanese");
            tokyo.setRating(4.7);
            tokyo.setDeliveryTime("30-40 min");
            tokyo.setMinOrder(20.00);
            tokyo.setImage("https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop");
            tokyo.setAddress("456 Oak Ave, Midtown");
            tokyo.setIsOpen(true);
            restaurants.add(tokyo);

            Restaurant burger = new Restaurant();
            burger.setName("The Burger Joint");
            burger.setCuisine("American");
            burger.setRating(4.3);
            burger.setDeliveryTime("20-30 min");
            burger.setMinOrder(10.00);
            burger.setImage("https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop");
            burger.setAddress("789 Elm St, Uptown");
            burger.setIsOpen(true);
            restaurants.add(burger);

            Restaurant greens = new Restaurant();
            greens.setName("Fresh Greens Co.");
            greens.setCuisine("Healthy");
            greens.setRating(4.6);
            greens.setDeliveryTime("15-25 min");
            greens.setMinOrder(12.00);
            greens.setImage("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop");
            greens.setAddress("321 Pine Rd, Downtown");
            greens.setIsOpen(true);
            restaurants.add(greens);

            // Save restaurants
            restaurantRepository.saveAll(restaurants);

            // Create menu items
            List<MenuItem> menuItems = new ArrayList<>();

            // Luigi's Italian Kitchen - 7 dishes
            menuItems.add(createMenuItem("Margherita Pizza", "Classic pizza with fresh mozzarella, tomato sauce, and basil", 12.99, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop", "Pizza", luigi, true, 4.5));
            menuItems.add(createMenuItem("Pepperoni Pizza", "Traditional pepperoni with mozzarella cheese", 14.99, "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop", "Pizza", luigi, false, 4.6));
            menuItems.add(createMenuItem("Quattro Formaggi Pizza", "Four cheese pizza with mozzarella, gorgonzola, parmesan, and ricotta", 15.99, "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=400&fit=crop", "Pizza", luigi, true, 4.7));
            menuItems.add(createMenuItem("Spaghetti Carbonara", "Creamy pasta with pancetta, eggs, and parmesan", 13.99, "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=400&fit=crop", "Pasta", luigi, false, 4.8));
            menuItems.add(createMenuItem("Fettuccine Alfredo", "Rich and creamy fettuccine with parmesan sauce", 12.99, "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=400&fit=crop", "Pasta", luigi, true, 4.6));
            menuItems.add(createMenuItem("Lasagna Bolognese", "Layered pasta with meat sauce, béchamel, and cheese", 16.99, "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=400&fit=crop", "Pasta", luigi, false, 4.9));
            menuItems.add(createMenuItem("Tiramisu", "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone", 7.99, "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop", "Desserts", luigi, true, 4.8));

            // Tokyo Sushi Bar - 7 dishes
            menuItems.add(createMenuItem("California Roll", "Fresh crab, avocado, and cucumber", 9.99, "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=400&fit=crop", "Sushi", tokyo, false, 4.7));
            menuItems.add(createMenuItem("Salmon Nigiri", "Premium salmon over seasoned rice", 11.99, "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&h=400&fit=crop", "Sushi", tokyo, false, 4.8));
            menuItems.add(createMenuItem("Spicy Tuna Roll", "Fresh tuna with spicy mayo and cucumber", 12.99, "https://images.unsplash.com/photo-1563612116625-3012372fccce?w=500&h=400&fit=crop", "Sushi", tokyo, false, 4.6));
            menuItems.add(createMenuItem("Dragon Roll", "Eel, cucumber, topped with avocado and eel sauce", 14.99, "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=400&fit=crop", "Sushi", tokyo, false, 4.9));
            menuItems.add(createMenuItem("Chicken Teriyaki", "Grilled chicken with teriyaki sauce, served with rice", 13.99, "https://images.unsplash.com/photo-1606557187441-48b929a2a0b2?w=500&h=400&fit=crop", "Entrees", tokyo, false, 4.5));
            menuItems.add(createMenuItem("Beef Ramen", "Rich broth with tender beef, noodles, and soft-boiled egg", 14.99, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop", "Ramen", tokyo, false, 4.8));
            menuItems.add(createMenuItem("Vegetable Tempura", "Lightly battered and fried seasonal vegetables", 10.99, "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&h=400&fit=crop", "Appetizers", tokyo, true, 4.4));

            // The Burger Joint - 7 dishes
            menuItems.add(createMenuItem("Classic Burger", "Beef patty with lettuce, tomato, and special sauce", 10.99, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop", "Burgers", burger, false, 4.4));
            menuItems.add(createMenuItem("Bacon Cheeseburger", "Double beef patty with crispy bacon and cheddar cheese", 13.99, "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&h=400&fit=crop", "Burgers", burger, false, 4.7));
            menuItems.add(createMenuItem("Veggie Burger", "Plant-based patty with avocado and fresh veggies", 11.99, "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500&h=400&fit=crop", "Burgers", burger, true, 4.3));
            menuItems.add(createMenuItem("BBQ Pulled Pork Burger", "Slow-cooked pulled pork with BBQ sauce and coleslaw", 12.99, "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&h=400&fit=crop", "Burgers", burger, false, 4.6));
            menuItems.add(createMenuItem("Crispy Chicken Sandwich", "Fried chicken breast with pickles and mayo", 11.99, "https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=500&h=400&fit=crop", "Sandwiches", burger, false, 4.5));
            menuItems.add(createMenuItem("Loaded Fries", "Crispy fries topped with cheese, bacon, and sour cream", 7.99, "https://images.unsplash.com/photo-1630431341973-02e1d0f45a0f?w=500&h=400&fit=crop", "Sides", burger, false, 4.6));
            menuItems.add(createMenuItem("Onion Rings", "Golden fried onion rings with ranch dipping sauce", 6.99, "https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&h=400&fit=crop", "Sides", burger, true, 4.4));

            // Fresh Greens Co. - 7 dishes
            menuItems.add(createMenuItem("Caesar Salad", "Fresh romaine with parmesan and caesar dressing", 8.99, "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop", "Salads", greens, true, 4.5));
            menuItems.add(createMenuItem("Greek Salad", "Tomatoes, cucumber, olives, feta cheese, and olive oil", 9.99, "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=400&fit=crop", "Salads", greens, true, 4.6));
            menuItems.add(createMenuItem("Grilled Chicken Bowl", "Quinoa, grilled chicken, avocado, and mixed greens", 13.99, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=400&fit=crop", "Bowls", greens, false, 4.7));
            menuItems.add(createMenuItem("Buddha Bowl", "Roasted vegetables, chickpeas, quinoa, and tahini dressing", 12.99, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop", "Bowls", greens, true, 4.8));
            menuItems.add(createMenuItem("Salmon Poke Bowl", "Fresh salmon, edamame, seaweed, and sushi rice", 15.99, "https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=500&h=400&fit=crop", "Bowls", greens, false, 4.9));
            menuItems.add(createMenuItem("Green Smoothie", "Spinach, banana, mango, and almond milk", 6.99, "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&h=400&fit=crop", "Smoothies", greens, true, 4.5));
            menuItems.add(createMenuItem("Acai Bowl", "Acai blend topped with granola, berries, and honey", 10.99, "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&h=400&fit=crop", "Bowls", greens, true, 4.7));

            // Save all menu items
            menuItemRepository.saveAll(menuItems);

            response.put("success", true);
            response.put("message", "Menu data refreshed successfully");
            response.put("restaurantsCreated", restaurants.size());
            response.put("menuItemsCreated", menuItems.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private MenuItem createMenuItem(String name, String description, double price, String image,
                                    String category, Restaurant restaurant, boolean isVeg, double rating) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setImage(image);
        item.setCategory(category);
        item.setRestaurant(restaurant);
        item.setIsVeg(isVeg);
        item.setRating(rating);
        return item;
    }
}

