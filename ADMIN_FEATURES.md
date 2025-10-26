# Admin Features Documentation

## Overview

The Taste Track application now includes a comprehensive admin panel with role-based authentication and full CRUD operations for managing restaurants, menu items, and orders.

## Admin Login

### Credentials
- **Email**: `admin@tastetrack.com`
- **Password**: `password`

### Access
1. Navigate to `/admin/login` in your browser
2. Enter the admin credentials
3. The system validates that the user has the ADMIN role
4. Upon successful login, you'll be redirected to the admin dashboard

### Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes that verify admin role
- Automatic logout functionality
- Token stored securely in localStorage

## Admin Features

### 1. Food Item Management

**Location**: `/admin/menu`

**Features**:
- ✅ View all menu items across all restaurants
- ✅ Search menu items by name
- ✅ Filter menu items by restaurant
- ✅ Add new menu items
- ✅ Edit existing menu items
- ✅ Delete menu items
- ✅ View item details (name, description, price, category, rating, restaurant)

**How to Use**:

**Add Menu Item**:
1. Click "Add Menu Item" button
2. Fill in the form:
   - Name (required)
   - Description (required)
   - Price (required)
   - Category (required)
   - Restaurant (select from dropdown)
   - Rating (optional, default: 4.0)
   - Image URL (optional)
   - Vegetarian toggle
3. Click "Create"

**Edit Menu Item**:
1. Click "Edit" button on any menu item card
2. Update the fields you want to change
3. Click "Update"

**Delete Menu Item**:
1. Click the trash icon on any menu item card
2. Confirm deletion in the dialog
3. Item will be permanently removed

### 2. Order Status Management

**Location**: `/admin/orders`

**Features**:
- ✅ View all orders from all customers
- ✅ Search orders by order number
- ✅ Filter orders by status
- ✅ Update order status through workflow
- ✅ Cancel orders
- ✅ View order details (items, customer, delivery address, total)

**Order Status Workflow**:
1. **PENDING** → Click "Confirm Order" → **CONFIRMED**
2. **CONFIRMED** → Click "Start Preparing" → **PREPARING**
3. **PREPARING** → Click "Out for Delivery" → **OUT_FOR_DELIVERY**
4. **OUT_FOR_DELIVERY** → Click "Mark Delivered" → **DELIVERED**

**Cancel Order**:
- Orders can only be cancelled when in PENDING or CONFIRMED status
- Click "Cancel Order" button
- Order status changes to CANCELLED

**Order Information Displayed**:
- Order number
- Customer name
- Restaurant name
- Order date and time
- Order items with quantities and prices
- Delivery address
- Total amount
- Current status

### 3. Restaurant Management

**Location**: `/admin/restaurants`

**Features**:
- ✅ View all restaurants
- ✅ Search restaurants by name
- ✅ Add new restaurants
- ✅ Edit restaurant details
- ✅ Delete restaurants
- ✅ Toggle restaurant availability (Open/Closed)
- ✅ View restaurant details (name, cuisine, rating, delivery time, min order, address)

**How to Use**:

**Add Restaurant**:
1. Click "Add Restaurant" button
2. Fill in the form:
   - Name (required)
   - Cuisine (required)
   - Address (required)
   - Rating (optional, default: 4.0)
   - Delivery Time (required, e.g., "25-35 min")
   - Minimum Order (required, in dollars)
   - Image URL (optional)
   - Is Open toggle (default: true)
3. Click "Create"

**Edit Restaurant**:
1. Click "Edit" button on any restaurant card
2. Update the fields you want to change
3. Toggle "Restaurant is Open" to change availability
4. Click "Update"

**Delete Restaurant**:
1. Click "Delete" button on any restaurant card
2. Confirm deletion in the dialog
3. Restaurant will be permanently removed

**Restaurant Availability**:
- Green "Open" badge indicates restaurant is accepting orders
- Gray "Closed" badge indicates restaurant is not accepting orders
- Toggle availability in the edit dialog

## Navigation

The admin panel includes a navigation bar with:
- Links to Dashboard, Orders, Menu, and Restaurants
- User information display (shows "Admin: [FirstName]")
- Logout button

## Technical Implementation

### Frontend Components

**New Components Created**:
1. `src/pages/AdminLogin.tsx` - Admin login page with role validation
2. `src/components/ProtectedRoute.tsx` - HOC for protecting admin routes
3. `src/components/admin/MenuItemDialog.tsx` - Dialog for add/edit menu items
4. `src/components/admin/RestaurantDialog.tsx` - Dialog for add/edit restaurants

**Updated Components**:
1. `src/App.tsx` - Added admin login route and protected admin routes
2. `src/components/Navbar.tsx` - Added logout functionality and user display
3. `src/lib/api.ts` - Extended with CRUD methods for all resources
4. `src/pages/admin/Menu.tsx` - Integrated with real API data
5. `src/pages/admin/Orders.tsx` - Integrated with real API data and status updates
6. `src/pages/admin/Restaurants.tsx` - Integrated with real API data

### Backend Endpoints Used

**Authentication**:
- `POST /api/auth/login` - Login with email and password

**Menu Items**:
- `GET /api/menu-items/restaurant/{restaurantId}` - Get menu items by restaurant
- `POST /api/menu-items` - Create menu item
- `PUT /api/menu-items/{id}` - Update menu item
- `DELETE /api/menu-items/{id}` - Delete menu item

**Orders**:
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/{id}/status/{status}` - Update order status

**Restaurants**:
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant
- `PUT /api/restaurants/{id}` - Update restaurant
- `DELETE /api/restaurants/{id}` - Delete restaurant

### Data Flow

1. **Authentication**: User logs in → JWT token generated → Token stored in localStorage
2. **Authorization**: Each API request includes JWT token in Authorization header
3. **Role Validation**: Backend validates ADMIN role from JWT claims
4. **CRUD Operations**: Admin performs operations → API calls with auth token → Database updates
5. **Real-time Updates**: After each operation, data is reloaded to reflect changes

## Testing the Admin Features

### Prerequisites
1. Backend server running on `http://localhost:8081`
2. Frontend running on `http://localhost:5173` or `http://localhost:8080`
3. Database populated with initial data

### Test Scenarios

**Test 1: Admin Login**
1. Navigate to `http://localhost:5173/admin/login`
2. Enter credentials: `admin@tastetrack.com` / `password`
3. Verify redirect to admin dashboard
4. Verify user info displayed in navbar

**Test 2: Menu Item Management**
1. Navigate to `/admin/menu`
2. Verify all menu items are displayed
3. Add a new menu item
4. Edit an existing menu item
5. Delete a menu item
6. Verify changes persist after page reload

**Test 3: Order Management**
1. Place an order as a customer (use customer login)
2. Login as admin
3. Navigate to `/admin/orders`
4. Find the order you just placed
5. Update status through the workflow: PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
6. Verify status updates are reflected

**Test 4: Restaurant Management**
1. Navigate to `/admin/restaurants`
2. Add a new restaurant
3. Edit restaurant details
4. Toggle restaurant availability
5. Delete a restaurant
6. Verify changes persist

**Test 5: Protected Routes**
1. Logout from admin
2. Try to access `/admin/menu` directly
3. Verify redirect to login page
4. Login as a regular customer
5. Try to access `/admin/menu`
6. Verify access is denied (should redirect)

## Troubleshooting

### Issue: Cannot login as admin
**Solution**: Verify the admin user exists in the database. Check `backend/src/main/resources/database-schema.sql` for the admin user entry.

### Issue: 401 Unauthorized errors
**Solution**: 
- Check if JWT token is present in localStorage
- Verify token hasn't expired
- Try logging out and logging back in

### Issue: Menu items not loading
**Solution**:
- Check browser console for errors
- Verify backend is running
- Check CORS configuration in backend

### Issue: Changes not persisting
**Solution**:
- Check browser console for API errors
- Verify database connection
- Check backend logs for errors

### Issue: Cannot update order status
**Solution**:
- Verify order is in correct status for the transition
- Check if user has ADMIN role
- Verify backend endpoint is accessible

## Future Enhancements

Potential improvements for the admin panel:
- Dashboard with analytics and statistics
- Bulk operations for menu items
- Order filtering by date range
- Export orders to CSV/PDF
- Image upload functionality
- Real-time notifications for new orders
- Multi-restaurant admin support
- Audit logs for admin actions
- Advanced search and filtering
- Performance metrics and reports

