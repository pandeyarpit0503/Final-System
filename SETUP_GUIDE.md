# Taste Track - Full Stack Setup Guide

This guide will help you set up and connect the Java Spring Boot backend with MySQL database to your React frontend.

## Prerequisites

1. **Java 17** or higher - [Download](https://www.oracle.com/java/technologies/downloads/)
2. **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
3. **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
4. **Node.js 18+** - [Download](https://nodejs.org/)
5. **Git** - [Download](https://git-scm.com/downloads)

## Backend Setup

### 1. Install MySQL

Install and start MySQL server on your machine.

### 2. Create Database

Open MySQL command line or any MySQL client and run:

```sql
CREATE DATABASE tastetrack_db;
```

### 3. Configure Database Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
```

### 4. Build and Run Backend

Open a terminal in the project root and run:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will be available at `http://localhost:8081`

**Note**: The application will automatically create tables. If you want to use the pre-seeded data, run:

```bash
mysql -u root -p tastetrack_db < backend/src/main/resources/database-schema.sql
```

### 5. Verify Backend

Test the API by visiting:
- `http://localhost:8081/api/restaurants`
- `http://localhost:8081/api/menu-items/restaurant/1`

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Connect to Backend

The API service has been created in `src/lib/api.ts`. To use it in your pages, you need to:

**Option 1**: Replace mock data calls with API calls gradually

**Option 2**: Use the API service for new implementations

### 3. Run Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Testing the Connection

### Test Authentication

```bash
# Sign up
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Restaurants

```bash
# Get all restaurants
curl http://localhost:8081/api/restaurants

# Get specific restaurant
curl http://localhost:8081/api/restaurants/1
```

### Test Menu Items

```bash
# Get menu items for restaurant
curl http://localhost:8081/api/menu-items/restaurant/1
```

## Default Test Credentials

**Customer Account:**
- Email: `john.doe@example.com`
- Password: `password`

**Admin Account:**
- Email: `admin@tastetrack.com`
- Password: `password`

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/open` - Get open restaurants
- `GET /api/restaurants/{id}` - Get restaurant by ID
- `GET /api/restaurants/search?q={query}` - Search restaurants

### Menu Items
- `GET /api/menu-items/restaurant/{restaurantId}` - Get menu items for restaurant
- `GET /api/menu-items/{id}` - Get menu item by ID

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/{userId}` - Get user orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status/{status}` - Update order status

## Connecting Frontend to Backend

### Current Status

The backend API is ready and fully functional. The frontend currently uses mock data from `src/lib/mockData.ts`.

### To Connect Frontend:

1. **Import the API service** in your components:
```typescript
import { restaurantAPI, menuItemAPI, orderAPI } from '@/lib/api';
```

2. **Replace mock data calls** with API calls:

**Before (using mock data):**
```typescript
const restaurants = mockRestaurants;
```

**After (using API):**
```typescript
const [restaurants, setRestaurants] = useState([]);
useEffect(() => {
  restaurantAPI.getAll().then(setRestaurants);
}, []);
```

3. **Update pages** one by one to use the API:
   - Start with `src/pages/Restaurants.tsx`
   - Then `src/pages/RestaurantDetail.tsx`
   - Then `src/pages/Orders.tsx`
   - And so on...

### Example Integration

Here's how to update `Restaurants.tsx` to use the backend:

```typescript
import { useState, useEffect } from 'react';
import { restaurantAPI } from '@/lib/api';
import { Restaurant } from '@/lib/mockData';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  useEffect(() => {
    restaurantAPI.getAll().then((data) => setRestaurants(data));
  }, []);

  // ... rest of component logic
};
```

## Database Schema

The database includes these tables:

- **users** - User accounts (customers and admins)
- **restaurants** - Restaurant information
- **menu_items** - Menu items for each restaurant
- **orders** - Order information
- **order_items** - Order line items
- **payments** - Payment records
- **deliveries** - Delivery information

See `backend/src/main/resources/database-schema.sql` for the complete schema.

## Troubleshooting

### Backend won't start

1. Check if MySQL is running
2. Verify database credentials in `application.properties`
3. Check if port 8081 is available
4. Review logs for specific errors

### CORS Errors

The backend is configured to allow requests from:
- `http://localhost:8080`
- `http://localhost:5173`
- `http://localhost:3000`

If using a different port, update `backend/src/main/java/com/tastetrack/config/SecurityConfig.java`

### Database Connection Errors

1. Ensure MySQL service is running
2. Verify username/password in `application.properties`
3. Check database name is `tastetrack_db`
4. Verify MySQL is accessible on localhost:3306

## Project Structure

```
taste-track-tasty-main/
├── backend/                    # Java Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tastetrack/
│   │   │   │   ├── config/    # Configuration files
│   │   │   │   ├── controller/ # REST controllers
│   │   │   │   ├── dto/       # Data Transfer Objects
│   │   │   │   ├── entity/    # JPA entities
│   │   │   │   ├── repository/# JPA repositories
│   │   │   │   ├── service/   # Business logic
│   │   │   │   └── util/      # Utilities
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
├── src/                        # React frontend
│   ├── lib/
│   │   ├── api.ts             # API service layer
│   │   └── mockData.ts        # Mock data (to be replaced)
│   └── pages/                  # Frontend pages
└── SETUP_GUIDE.md             # This file
```

## Next Steps

1. ✅ Backend is ready and running
2. ✅ Database schema is created
3. ✅ API endpoints are working
4. 📝 Gradually connect frontend to backend
5. 📝 Test all functionality end-to-end
6. 📝 Add authentication token handling
7. 📝 Deploy to production (optional)

## Support

For issues or questions:
1. Check the logs in the terminal
2. Verify all services are running
3. Test API endpoints with Postman or curl
4. Review this guide for common issues

## License

Copyright © 2024 Taste Track. All rights reserved.
