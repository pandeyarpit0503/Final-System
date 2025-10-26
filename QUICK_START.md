# Quick Start Guide - Taste Track

## ✅ Build Fixed!

All compilation errors have been resolved. The backend is now ready to run.

## What Was Fixed

1. **Lombok Configuration**: Added proper Lombok annotation processing configuration to Maven compiler plugin
2. **DTO Classes**: Split nested DTO classes into separate files (OrderRequest, OrderItemRequest, DeliveryRequest, PaymentRequest)
3. **JWT Library**: Updated JWT parser methods to work with JJWT 0.12.3

## Running the Backend

### 1. Ensure MySQL is Running

Make sure MySQL server is running on your machine.

### 2. Verify Database Configuration

The database settings are in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tastetrack_db
spring.datasource.username=root
spring.datasource.password=password  # Update this to match your MySQL password
```

### 3. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Test the API

Open your browser or use curl:
```bash
# Test restaurants endpoint
curl http://localhost:8080/api/restaurants

# Test menu items
curl http://localhost:8080/api/menu-items/restaurant/1
```

## Running the Frontend

In a separate terminal:

```bash
npm install
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Default Test Accounts

After running the database schema:

**Customer:**
- Email: `john.doe@example.com`
- Password: `password`

**Admin:**
- Email: `admin@tastetrack.com`
- Password: `password`

## Project Structure

```
taste-track-tasty-main/
├── backend/                # Spring Boot backend
│   ├── src/main/java/com/tastetrack/
│   │   ├── config/        # Security, CORS config
│   │   ├── controller/    # REST endpoints
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── entity/        # JPA entities
│   │   ├── repository/    # Database repositories
│   │   ├── service/       # Business logic
│   │   └── util/          # JWT utilities
│   └── src/main/resources/
│       ├── application.properties
│       └── database-schema.sql
└── src/                   # React frontend
    ├── lib/api.ts         # API service layer
    └── pages/             # Frontend pages
```

## Available API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/{id}` - Get restaurant by ID
- `GET /api/restaurants/search?q={query}` - Search restaurants

### Menu Items
- `GET /api/menu-items/restaurant/{restaurantId}` - Get menu for restaurant
- `GET /api/menu-items/{id}` - Get specific menu item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/{userId}` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status/{status}` - Update order status

## Troubleshooting

### Port 8080 Already in Use
```bash
# Find and kill the process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### MySQL Connection Error
- Verify MySQL is running
- Check username/password in `application.properties`
- Ensure database `tastetrack_db` exists

### Frontend Can't Connect to Backend
- Verify backend is running on port 8080
- Check browser console for CORS errors
- Ensure CORS is configured correctly in `SecurityConfig.java`

## Next Steps

1. ✅ Backend built successfully
2. ✅ All compilation errors fixed
3. 🟡 Start MySQL server
4. 🟡 Run the backend with `mvn spring-boot:run`
5. 🟡 Test API endpoints
6. 🟡 Start frontend with `npm run dev`
7. 🟡 Connect frontend to backend (optional - currently uses mock data)

## Support

For issues, check:
- `SETUP_GUIDE.md` - Detailed setup instructions
- `backend/README.md` - Backend-specific documentation
- Terminal logs for error messages
