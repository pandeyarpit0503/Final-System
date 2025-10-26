import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { mockOrders, mockRestaurants } from '@/lib/mockData';

const Orders = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-secondary" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-accent" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      pending: 'outline',
      confirmed: 'secondary',
      preparing: 'secondary',
      'out-for-delivery': 'default',
      delivered: 'secondary',
      cancelled: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="capitalize">
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const activeOrders = mockOrders.filter((order) =>
    ['pending', 'confirmed', 'preparing', 'out-for-delivery'].includes(order.status)
  );

  const pastOrders = mockOrders.filter((order) =>
    ['delivered', 'cancelled'].includes(order.status)
  );

  const renderOrderCard = (order: typeof mockOrders[0]) => {
    const restaurant = mockRestaurants.find((r) => r.id === order.restaurantId);
    
    return (
      <Card key={order.id} className="hover:shadow-food-card transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="mt-1">{getStatusIcon(order.status)}</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{restaurant?.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {new Date(order.orderDate).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="text-sm text-muted-foreground">
                      {item.quantity}x {item.menuItem.name}
                      {idx < order.items.length - 1 && ','}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(order.status)}
              <p className="text-lg font-bold mt-2">${order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Link to={`/track/${order.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Track Order
              </Button>
            </Link>
            {order.status === 'delivered' && (
              <Button className="flex-1">Reorder</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="active">
              Active Orders ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Orders ({pastOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeOrders.length > 0 ? (
              activeOrders.map(renderOrderCard)
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No active orders</h3>
                <p className="text-muted-foreground mb-6">
                  Start ordering from your favorite restaurants
                </p>
                <Link to="/restaurants">
                  <Button>Browse Restaurants</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastOrders.length > 0 ? (
              pastOrders.map(renderOrderCard)
            ) : (
              <Card className="p-12 text-center">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No past orders</h3>
                <p className="text-muted-foreground">Your order history will appear here</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;
