
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  PackageX, 
  Truck,
  CalendarClock
} from "lucide-react";
import { format } from 'date-fns';
import { Order, OrderItem, updateOrderStatus } from "@/services/orderService";

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onStatusUpdate: (orderId: string, status: string) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  isOpen, 
  onClose, 
  order,
  onStatusUpdate
}) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<string>('');
  
  if (!order) return null;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <PackageCheck className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <PackageX className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleUpdateStatus = (status: string) => {
    setNewStatus(status);
    setConfirmDialogOpen(true);
  };
  
  const confirmStatusUpdate = async () => {
    onStatusUpdate(order.id, newStatus);
    setConfirmDialogOpen(false);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Information</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-medium">Order ID:</span> {order.id}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className="inline-flex items-center gap-1 ml-1">
                      {getStatusIcon(order.status)} 
                      <span className="capitalize">{order.status}</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-1">
                    <CalendarClock size={16} className="text-gray-400" />
                    <span>{formatDate(order.created_at)}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-medium">Shop Name:</span> {order.shop_name}</p>
                  <p><span className="font-medium">Phone:</span> {order.phone_number}</p>
                  <p><span className="font-medium">Address:</span> {order.address}</p>
                  <p><span className="font-medium">City:</span> {order.city}</p>
                </div>
              </div>
            </div>
            
            {/* Order Items Table */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.product?.name || "Unknown Product"}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">No items found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Order Total */}
              <div className="flex justify-end mt-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between text-base font-medium">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Update Status Controls */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Update Order Status</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={order.status === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus('pending')}
                  disabled={order.status === 'pending'}
                >
                  <Clock className="mr-1 h-4 w-4" />
                  Pending
                </Button>
                <Button 
                  variant={order.status === 'processing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus('processing')}
                  disabled={order.status === 'processing'}
                >
                  <PackageCheck className="mr-1 h-4 w-4" />
                  Processing
                </Button>
                <Button 
                  variant={order.status === 'shipped' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus('shipped')}
                  disabled={order.status === 'shipped'}
                >
                  <Truck className="mr-1 h-4 w-4" />
                  Shipped
                </Button>
                <Button 
                  variant={order.status === 'delivered' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus('delivered')}
                  disabled={order.status === 'delivered'}
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Delivered
                </Button>
                <Button 
                  variant={order.status === 'cancelled' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={order.status === 'cancelled'}
                >
                  <PackageX className="mr-1 h-4 w-4" />
                  Cancelled
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this order status to <span className="font-medium capitalize">{newStatus}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusUpdate}>Update</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderDetails;
