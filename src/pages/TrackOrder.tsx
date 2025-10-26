import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Package, Truck, MapPin } from 'lucide-react';
import { mockOrders, mockRestaurants } from '@/lib/mockData';

const TrackOrder = () => {
  const { orderId } = useParams();
  const order = mockOrders.find((o) => o.id === orderId);
  const restaurant = order ? mockRestaurants.find((r) => r.id === order.restaurantId) : null;

  if (!order || !restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Order not found</h1>
          <Link to="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderSteps = [
    { status: 'pending', label: 'Order Placed', icon: CheckCircle, time: order.orderDate },
    { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, time: order.orderDate },
    { status: 'preparing', label: 'Preparing Food', icon: Package, time: null },
    { status: 'out-for-delivery', label: 'Out for Delivery', icon: Truck, time: null },
    { status: 'delivered', label: 'Delivered', icon: MapPin, time: order.estimatedDelivery },
  ];

  const currentStepIndex = orderSteps.findIndex((step) => step.status === order.status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/orders">
            <Button variant="ghost" className="mb-4">← Back to Orders</Button>
          </Link>
          <h1 className="text-3xl font-bold">Track Order</h1>
          <p className="text-muted-foreground">Order ID: {order.id}</p>
        </div>

        <div className="grid gap-6">
          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orderSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-muted bg-background'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {index < orderSteps.length - 1 && (
                          <div
                            className={`h-12 w-0.5 ${
                              isCompleted && !isCurrent ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        )}
                      </div>
                      
                      <div className={`flex-1 ${isCurrent ? '' : 'pt-2'}`}>
                        <h3
                          className={`font-semibold ${
                            isCurrent ? 'text-primary' : isCompleted ? '' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </h3>
                        {step.time && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(step.time).toLocaleTimeString()}
                          </p>
                        )}
                        {isCurrent && (
                          <p className="text-sm text-primary mt-1">In Progress</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{restaurant.name}</h3>
                <p className="text-sm text-muted-foreground">{restaurant.address}</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-semibold">Items</h4>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-medium">
                      ${(item.quantity * item.menuItem.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(order.total - 3.99 - order.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${(order.total * 0.08).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Delivery Address</h4>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Estimated Delivery */}
          {order.estimatedDelivery && order.status !== 'delivered' && (
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8" />
                  <div>
                    <p className="text-sm opacity-90">Estimated Delivery</p>
                    <p className="text-xl font-bold">
                      {new Date(order.estimatedDelivery).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
