# Taste Track Backend

A Java Spring Boot REST API backend for the Taste Track food ordering system.

## Features

- **User Management**: Registration, authentication, and profile management
- **Restaurant Management**: CRUD operations for restaurants
- **Menu Management**: Add, update, and delete menu items
- **Order Management**: Place orders, track status, and manage deliveries
- **Payment Management**: Process and store payment information
- **Delivery Management**: Track and update delivery status
- **Security**: JWT-based authentication with Spring Security
- **Database**: MySQL database with JPA/Hibernate

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security**
- **Spring Data JPA**
- **MySQL**
- **JWT**
- **Lombok**
- **Maven**

## Setup Instructions

### Prerequisites

1. **Java 17** or higher
2. **Maven 3.6+**
3. **MySQL 8.0+**

### Database Setup

1. Install MySQL and create a database:
```sql
CREATE DATABASE tastetrack_db;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. The application will automatically create tables using JPA. Alternatively, you can run the SQL script:
```bash
mysql -u root -p tastetrack_db < src/main/resources/database-schema.sql
```

### Running the Application

1. **Clone the repository** (if not already done)

2. **Navigate to the backend directory**:
```bash
cd backend
```

3. **Build the project**:
```bash
mvn clean install
```

4. **Run the application**:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### Default Credentials

The database is pre-seeded with test data:

**Customer Account:**
- Email: `john.doe@example.com`
- Password: `password`

**Admin Account:**
- Email: `admin@tastetrack.com`
- Password: `password`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/open` - Get open restaurants
- `GET /api/restaurants/{id}` - Get restaurant by ID
- `GET /api/restaurants/search?q={query}` - Search restaurants
- `POST /api/restaurants` - Create restaurant (Admin)
- `PUT /api/restaurants/{id}` - Update restaurant (Admin)
- `DELETE /api/restaurants/{id}` - Delete restaurant (Admin)

### Menu Items
- `GET /api/menu-items/restaurant/{restaurantId}` - Get menu items for restaurant
- `GET /api/menu-items/restaurant/{restaurantId}/category/{category}` - Get menu items by category
- `GET /api/menu-items/{id}` - Get menu item by ID
- `POST /api/menu-items` - Create menu item (Admin)
- `PUT /api/menu-items/{id}` - Update menu item (Admin)
- `DELETE /api/menu-items/{id}` - Delete menu item (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/{userId}` - Get user orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/order-number/{orderNumber}` - Get order by order number
- `GET /api/orders/status/{status}` - Get orders by status
- `PUT /api/orders/{id}/status/{status}` - Update order status
- `DELETE /api/orders/{id}` - Cancel order

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `restaurants` - Restaurant information
- `menu_items` - Menu items
- `orders` - Order information
- `order_items` - Order line items
- `payments` - Payment records
- `deliveries` - Delivery information

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173`
- `http://localhost:3000`

## Configuration

Key configuration files:
- `src/main/resources/application.properties` - Application and database configuration
- `src/main/java/com/tastetrack/config/SecurityConfig.java` - Security and CORS configuration

## Development

### Hot Reload

Spring Boot DevTools is included for automatic application restart during development.

### Logging

Logging is configured to show SQL queries. To disable, set in `application.properties`:
```properties
spring.jpa.show-sql=false
```

## License

Copyright © 2024 Taste Track. All rights reserved.
