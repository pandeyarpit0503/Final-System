import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { mockMenuItems } from '@/lib/mockData';
import pizzaImage from '@/assets/pizza.jpg';
import burgerImage from '@/assets/burger.jpg';
import sushiImage from '@/assets/sushi.jpg';
import saladImage from '@/assets/salad.jpg';
import { toast } from 'sonner';

const AdminMenu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurantFilter, setRestaurantFilter] = useState('all');
  const [menuItems] = useState(mockMenuItems);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRestaurant = restaurantFilter === 'all' || item.restaurantId === restaurantFilter;
    return matchesSearch && matchesRestaurant;
  });

  const getImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pizza': return pizzaImage;
      case 'burgers': return burgerImage;
      case 'sushi': return sushiImage;
      case 'salads':
      case 'bowls': return saladImage;
      default: return pizzaImage;
    }
  };

  const handleDelete = (id: string, name: string) => {
    toast.success(`Item "${name}" deleted`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Menu Items</h1>
            <p className="text-muted-foreground">Add, edit, or remove menu items</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={restaurantFilter} onValueChange={setRestaurantFilter}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by restaurant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Restaurants</SelectItem>
              <SelectItem value="1">Luigi's Italian Kitchen</SelectItem>
              <SelectItem value="2">Tokyo Sushi Bar</SelectItem>
              <SelectItem value="3">The Burger Joint</SelectItem>
              <SelectItem value="4">Fresh Greens Co.</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={getImage(item.category)}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <div className="flex gap-2 mb-2">
                      <Badge variant="outline">{item.category}</Badge>
                      {item.isVeg && <Badge variant="outline" className="bg-secondary/10">Veg</Badge>}
                    </div>
                  </div>
                  <p className="text-lg font-bold text-primary">${item.price}</p>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">Rating:</span>
                  <span className="text-sm font-medium">⭐ {item.rating}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No menu items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenu;
