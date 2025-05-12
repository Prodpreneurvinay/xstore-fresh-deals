
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Search,
  Plus,
  Filter
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-xstore-green">X</span>
            <span className="text-2xl font-bold">store</span>
            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded">Admin</span>
          </div>
        </div>
        
        <nav className="p-4">
          <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 pl-2">Menu</h3>
          <ul>
            <li className="mb-1">
              <button 
                onClick={() => setActiveTab("dashboard")} 
                className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${activeTab === "dashboard" ? "bg-xstore-green text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <BarChart3 size={16} />
                <span>Dashboard</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => setActiveTab("products")} 
                className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${activeTab === "products" ? "bg-xstore-green text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Package size={16} />
                <span>Products</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => setActiveTab("orders")}  
                className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${activeTab === "orders" ? "bg-xstore-green text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <ShoppingBag size={16} />
                <span>Orders</span>
              </button>
            </li>
            <li className="mb-1">
              <button 
                onClick={() => setActiveTab("settings")} 
                className={`w-full flex items-center space-x-2 px-2 py-2 rounded-md ${activeTab === "settings" ? "bg-xstore-green text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <div>
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900"
              >
                Log Out
              </Button>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="md:hidden grid grid-cols-4 gap-2 bg-transparent">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-xstore-green data-[state=active]:text-white">
                <BarChart3 size={16} />
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-xstore-green data-[state=active]:text-white">
                <Package size={16} />
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-xstore-green data-[state=active]:text-white">
                <ShoppingBag size={16} />
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-xstore-green data-[state=active]:text-white">
                <Settings size={16} />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard">
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-500 text-sm mb-1">Total Orders</h3>
                  <p className="text-3xl font-bold">428</p>
                  <span className="text-green-500 text-sm">+18% from last month</span>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-500 text-sm mb-1">Revenue</h3>
                  <p className="text-3xl font-bold">₹142,540</p>
                  <span className="text-green-500 text-sm">+24% from last month</span>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-500 text-sm mb-1">Total Products</h3>
                  <p className="text-3xl font-bold">182</p>
                  <span className="text-gray-500 text-sm">+3 added today</span>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-gray-500 text-sm mb-1">Active Customers</h3>
                  <p className="text-3xl font-bold">86</p>
                  <span className="text-green-500 text-sm">+12 new this week</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold mb-4">Recent Orders</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(order => (
                      <div key={order} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
                        <div>
                          <h4 className="font-medium">Order #{1000 + order}</h4>
                          <p className="text-sm text-gray-500">ABC General Store</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Delivering</span>
                          <p className="text-sm text-gray-500 mt-1">₹{1200 + (order * 100)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-xstore-green">View All Orders</Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold mb-4">Expiring Soon</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(product => (
                      <div key={product} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md">
                        <div>
                          <h4 className="font-medium">Product Name #{product}</h4>
                          <p className="text-sm text-gray-500">Stock: 24 units</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">5 days left</span>
                          <p className="text-sm text-gray-500 mt-1">Mumbai</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-xstore-green">View All Products</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Products</h2>
                <Button className="bg-xstore-green">
                  <Plus size={16} className="mr-2" />
                  Add Product
                </Button>
              </div>
              
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search products..." className="pl-10" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <Filter size={16} className="mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Category</th>
                        <th className="py-3 px-4 text-left">Price</th>
                        <th className="py-3 px-4 text-left">Expiry</th>
                        <th className="py-3 px-4 text-left">City</th>
                        <th className="py-3 px-4 text-left">Stock</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                        <tr key={item} className="hover:bg-gray-50">
                          <td className="py-3 px-4">Product Name #{item}</td>
                          <td className="py-3 px-4">Food Items</td>
                          <td className="py-3 px-4">
                            <span className="font-medium">₹{120 + (item * 10)}</span>
                            <span className="text-gray-500 line-through text-xs ml-1">₹{150 + (item * 10)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${item % 3 === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {item % 3 === 0 ? '7 days left' : '3 months left'}
                            </span>
                          </td>
                          <td className="py-3 px-4">Mumbai</td>
                          <td className="py-3 px-4">
                            <span className={`${item % 4 === 0 ? 'text-yellow-500' : 'text-green-600'}`}>
                              {item % 4 === 0 ? 'Low' : 'In Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">Edit</Button>
                              <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Showing 1-10 of 182 products
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Orders</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search orders..." className="pl-10" />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 text-left">Order ID</th>
                        <th className="py-3 px-4 text-left">Shop Name</th>
                        <th className="py-3 px-4 text-left">City</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Total</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                        <tr key={item} className="hover:bg-gray-50">
                          <td className="py-3 px-4">#ORD-{1000 + item}</td>
                          <td className="py-3 px-4">Shop Name #{item}</td>
                          <td className="py-3 px-4">Mumbai</td>
                          <td className="py-3 px-4">May {10 + item}, 2025</td>
                          <td className="py-3 px-4">
                            <span className="font-medium">₹{3200 + (item * 100)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item % 4 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                              item % 3 === 0 ? 'bg-blue-100 text-blue-800' : 
                              item % 2 === 0 ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {
                                item % 4 === 0 ? 'Pending' : 
                                item % 3 === 0 ? 'Delivering' : 
                                item % 2 === 0 ? 'Delivered' : 
                                'Processing'
                              }
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">View</Button>
                              <Button variant="ghost" size="sm">Update</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 border-t flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Showing 1-10 of 428 orders
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <Input id="email" type="email" defaultValue="admin@xstore.com" />
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                      <Input id="name" type="text" defaultValue="Admin User" />
                    </div>
                    <Button className="bg-xstore-green w-full">Save Changes</Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold mb-4">Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium mb-1">Current Password</label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium mb-1">New Password</label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm New Password</label>
                      <Input id="confirm-password" type="password" />
                    </div>
                    <Button className="bg-xstore-green w-full">Update Password</Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
                  <h3 className="font-semibold mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>New Order Notifications</span>
                      <div className="flex items-center">
                        <input type="checkbox" id="order-notifications" className="mr-2" defaultChecked />
                        <label htmlFor="order-notifications">Enabled</label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Low Stock Alerts</span>
                      <div className="flex items-center">
                        <input type="checkbox" id="stock-alerts" className="mr-2" defaultChecked />
                        <label htmlFor="stock-alerts">Enabled</label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Product Expiry Notifications</span>
                      <div className="flex items-center">
                        <input type="checkbox" id="expiry-notifications" className="mr-2" defaultChecked />
                        <label htmlFor="expiry-notifications">Enabled</label>
                      </div>
                    </div>
                    <Button className="bg-xstore-green">Save Notification Settings</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
