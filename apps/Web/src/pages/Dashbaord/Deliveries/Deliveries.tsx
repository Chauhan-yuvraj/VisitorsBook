import { useDeliveries } from "@/hooks/useDeliveries";
import DeliveryModal from "@/components/Delivery/DeliveryModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageControls } from "@/components/ui/PageControls";
import { DeliveryGrid } from "@/components/Delivery/DeliveryGrid";
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

export default function Deliveries() {
  const {
    deliveries,
    loading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    handleStatusUpdate,
    openDeleteAlert,
    confirmDelete,
    isDeleteAlertOpen,
    setIsDeleteAlertOpen,
  } = useDeliveries();  

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Deliveries" 
        description="Track and manage incoming deliveries." 
        actionLabel="Add Delivery" 
        onAction={() => setIsModalOpen(true)} 
      />

      <DeliveryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the delivery record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PageControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search deliveries..."
      />

      {loading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : (
        <DeliveryGrid
          deliveries={deliveries}
          onStatusUpdate={handleStatusUpdate}
          onDelete={openDeleteAlert}
        />
      )}
    </div>
  );
}
