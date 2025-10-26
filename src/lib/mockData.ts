export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  restaurantId: string;
  isVeg: boolean;
  rating: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  image: string;
  address: string;
  isOpen: boolean;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: { menuItem: MenuItem; quantity: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
}

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: "Luigi's Italian Kitchen",
    cuisine: 'Italian',
    rating: 4.5,
    deliveryTime: '25-35 min',
    minOrder: 15,
    image: '/placeholder.svg',
    address: '123 Main St, Downtown',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Tokyo Sushi Bar',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '30-40 min',
    minOrder: 20,
    image: '/placeholder.svg',
    address: '456 Oak Ave, Midtown',
    isOpen: true,
  },
  {
    id: '3',
    name: 'The Burger Joint',
    cuisine: 'American',
    rating: 4.3,
    deliveryTime: '20-30 min',
    minOrder: 10,
    image: '/placeholder.svg',
    address: '789 Elm St, Uptown',
    isOpen: true,
  },
  {
    id: '4',
    name: 'Fresh Greens Co.',
    cuisine: 'Healthy',
    rating: 4.6,
    deliveryTime: '15-25 min',
    minOrder: 12,
    image: '/placeholder.svg',
    address: '321 Pine Rd, Downtown',
    isOpen: true,
  },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
    price: 12.99,
    image: '',
    category: 'Pizza',
    restaurantId: '1',
    isVeg: true,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    description: 'Traditional pepperoni with mozzarella cheese',
    price: 14.99,
    image: '',
    category: 'Pizza',
    restaurantId: '1',
    isVeg: false,
    rating: 4.6,
  },
  {
    id: '3',
    name: 'California Roll',
    description: 'Fresh crab, avocado, and cucumber',
    price: 9.99,
    image: '',
    category: 'Sushi',
    restaurantId: '2',
    isVeg: false,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Salmon Nigiri',
    description: 'Premium salmon over seasoned rice',
    price: 11.99,
    image: '',
    category: 'Sushi',
    restaurantId: '2',
    isVeg: false,
    rating: 4.8,
  },
  {
    id: '5',
    name: 'Classic Burger',
    description: 'Beef patty with lettuce, tomato, and special sauce',
    price: 10.99,
    image: '',
    category: 'Burgers',
    restaurantId: '3',
    isVeg: false,
    rating: 4.4,
  },
  {
    id: '6',
    name: 'Veggie Burger',
    description: 'Plant-based patty with avocado and fresh veggies',
    price: 11.99,
    image: '',
    category: 'Burgers',
    restaurantId: '3',
    isVeg: true,
    rating: 4.3,
  },
  {
    id: '7',
    name: 'Caesar Salad',
    description: 'Fresh romaine with parmesan and caesar dressing',
    price: 8.99,
    image: '',
    category: 'Salads',
    restaurantId: '4',
    isVeg: true,
    rating: 4.5,
  },
  {
    id: '8',
    name: 'Grilled Chicken Bowl',
    description: 'Quinoa, grilled chicken, avocado, and mixed greens',
    price: 13.99,
    image: '',
    category: 'Bowls',
    restaurantId: '4',
    isVeg: false,
    rating: 4.7,
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: 'user1',
    restaurantId: '1',
    items: [
      { menuItem: mockMenuItems[0], quantity: 2 },
      { menuItem: mockMenuItems[1], quantity: 1 },
    ],
    total: 40.97,
    status: 'delivered',
    deliveryAddress: '123 Home St, Apt 4B',
    orderDate: '2025-10-20T18:30:00',
    estimatedDelivery: '2025-10-20T19:15:00',
  },
  {
    id: 'ORD002',
    userId: 'user1',
    restaurantId: '2',
    items: [
      { menuItem: mockMenuItems[2], quantity: 3 },
      { menuItem: mockMenuItems[3], quantity: 2 },
    ],
    total: 53.95,
    status: 'out-for-delivery',
    deliveryAddress: '123 Home St, Apt 4B',
    orderDate: '2025-10-26T12:00:00',
    estimatedDelivery: '2025-10-26T12:45:00',
  },
];
