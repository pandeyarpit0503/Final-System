-- Taste Track Database Schema
-- MySQL Database Schema for Food Ordering System

CREATE DATABASE IF NOT EXISTS tastetrack_db;
USE tastetrack_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cuisine VARCHAR(50) NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    delivery_time VARCHAR(20) NOT NULL,
    min_order DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    address VARCHAR(255) NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    category VARCHAR(50) NOT NULL,
    restaurant_id BIGINT NOT NULL,
    is_veg BOOLEAN NOT NULL DEFAULT FALSE,
    rating DECIMAL(3,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    delivery_address VARCHAR(255) NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    payment_method ENUM('CARD', 'WALLET', 'CASH_ON_DELIVERY') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    payment_date TIMESTAMP,
    transaction_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    delivery_city VARCHAR(50) NOT NULL,
    delivery_state VARCHAR(50) NOT NULL,
    delivery_zip VARCHAR(10) NOT NULL,
    delivery_instructions VARCHAR(500),
    delivery_date TIMESTAMP,
    status ENUM('PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('John', 'Doe', 'john.doe@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK7EnQW', '+1 (555) 123-4567', 'CUSTOMER'),
('Jane', 'Smith', 'admin@tastetrack.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK7EnQW', '+1 (555) 234-5678', 'ADMIN');

-- Password for both users is: password

INSERT INTO restaurants (name, cuisine, rating, delivery_time, min_order, image, address, is_open) VALUES
('Luigi''s Italian Kitchen', 'Italian', 4.5, '25-35 min', 15.00, '/placeholder.svg', '123 Main St, Downtown', TRUE),
('Tokyo Sushi Bar', 'Japanese', 4.7, '30-40 min', 20.00, '/placeholder.svg', '456 Oak Ave, Midtown', TRUE),
('The Burger Joint', 'American', 4.3, '20-30 min', 10.00, '/placeholder.svg', '789 Elm St, Uptown', TRUE),
('Fresh Greens Co.', 'Healthy', 4.6, '15-25 min', 12.00, '/placeholder.svg', '321 Pine Rd, Downtown', TRUE);

INSERT INTO menu_items (name, description, price, image, category, restaurant_id, is_veg, rating) VALUES
('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomato sauce, and basil', 12.99, '', 'Pizza', 1, TRUE, 4.5),
('Pepperoni Pizza', 'Traditional pepperoni with mozzarella cheese', 14.99, '', 'Pizza', 1, FALSE, 4.6),
('California Roll', 'Fresh crab, avocado, and cucumber', 9.99, '', 'Sushi', 2, FALSE, 4.7),
('Salmon Nigiri', 'Premium salmon over seasoned rice', 11.99, '', 'Sushi', 2, FALSE, 4.8),
('Classic Burger', 'Beef patty with lettuce, tomato, and special sauce', 10.99, '', 'Burgers', 3, FALSE, 4.4),
('Veggie Burger', 'Plant-based patty with avocado and fresh veggies', 11.99, '', 'Burgers', 3, TRUE, 4.3),
('Caesar Salad', 'Fresh romaine with parmesan and caesar dressing', 8.99, '', 'Salads', 4, TRUE, 4.5),
('Grilled Chicken Bowl', 'Quinoa, grilled chicken, avocado, and mixed greens', 13.99, '', 'Bowls', 4, FALSE, 4.7);

CREATE INDEX idx_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_date ON orders(order_date);
