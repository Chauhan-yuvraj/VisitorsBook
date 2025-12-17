import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDeliveries, updateDeliveryStatus, deleteDelivery } from "@/store/slices/deliverySlice";
import { Button } from "@/components/ui/Button";
import { Plus, Package, Search, Trash2, CheckCircle } from "lucide-react";
import DeliveryModal from "@/components/Delivery/DeliveryModal";

export default function Deliveries() {
  const dispatch = useAppDispatch();
  const { deliveries, loading } = useAppSelector((state) => state.deliveries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchDeliveries());
  }, [dispatch]);

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    if (currentStatus === "PENDING") {
      await dispatch(updateDeliveryStatus({ id, status: "COLLECTED" }));
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this delivery record?")) {
      await dispatch(deleteDelivery(id));
    }
  };

  const filteredDeliveries = deliveries.filter((d) =>
    d.recipientId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.carrier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
          <p className="text-muted-foreground">Manage incoming deliveries and packages.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Record Delivery
        </Button>
      </div>

      <DeliveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search deliveries..."
          className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeliveries.map((delivery) => (
            <div key={delivery._id} className="bg-card text-card-foreground rounded-xl border shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{delivery.recipientId?.name || "Unknown Recipient"}</h3>
                    <p className="text-sm text-muted-foreground">{delivery.carrier}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  delivery.status === "COLLECTED" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {delivery.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                {delivery.trackingNumber && (
                  <p><span className="text-muted-foreground">Tracking:</span> {delivery.trackingNumber}</p>
                )}
                <p><span className="text-muted-foreground">Arrived:</span> {new Date(delivery.createdAt).toLocaleDateString()}</p>
                {delivery.collectedAt && (
                  <p><span className="text-muted-foreground">Collected:</span> {new Date(delivery.collectedAt).toLocaleDateString()}</p>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {delivery.status === "PENDING" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleStatusUpdate(delivery._id, delivery.status)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Mark Collected
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(delivery._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
