import { useState } from "react";
import { useSelector } from "react-redux";
import { useMeetings } from "@/hooks/useMeetings";
import MeetingModal from "@/components/Meeting/MeetingModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageControls } from "@/components/ui/PageControls";
import { MeetingsGrid } from "@/components/Meeting/MeetingsGrid";
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
import type { RootState } from "@/store/store";
import type { Meeting } from "@/types/meeting";

export default function Meetings() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { meetings, loading, fetchMeetings, deleteMeeting } = useMeetings(user?._id);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetingToEdit, setMeetingToEdit] = useState<Meeting | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (meeting: Meeting) => {
    setMeetingToEdit(meeting);
    setIsModalOpen(true);
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    setMeetingToEdit(null);
    // Refresh meetings after modal closes
    if (user?._id) {
      await fetchMeetings(user._id);
    }
  };

  const openDeleteAlert = (id: string) => {
    setDeleteId(id);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteMeeting(deleteId);
      setIsDeleteAlertOpen(false);
      setDeleteId(null);
      // Refresh meetings after deletion
      if (user?._id) {
        await fetchMeetings(user._id);
      }
    }
  };

  // Filter meetings based on search query
  const filteredMeetings = meetings.filter((meeting) =>
    meeting.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.agenda?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    meeting.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Meetings" 
        description="View and manage your scheduled meetings." 
        actionLabel="Schedule Meeting" 
        onAction={() => {
          setMeetingToEdit(null);
          setIsModalOpen(true);
        }} 
      />
        
      <MeetingModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        meetingToEdit={meetingToEdit}
      />

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the meeting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PageControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search meetings..."
      />

      {loading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : (
        <MeetingsGrid
          meetings={filteredMeetings}
          onEdit={handleEdit}
          onDelete={openDeleteAlert}
        />
      )}
    </div>
  );
}

