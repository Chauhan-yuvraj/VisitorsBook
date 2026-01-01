import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  User,
} from "lucide-react";
import type { Meeting } from "@/types/meeting";

interface MeetingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
}

export default function MeetingDetailModal({
  isOpen,
  onClose,
  meeting,
}: MeetingDetailModalProps) {
  if (!meeting) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getParticipantNames = (participants: any[] | undefined) => {
    if (!Array.isArray(participants)) return [];

    return participants
      .map((p) => {
        if (typeof p === "string") return p;
        if (typeof p === "object" && p !== null)
          return p.name || p.fullName || p.email;
        return null;
      })
      .filter(Boolean) as string[];
  };

  const firstSlot = meeting.timeSlots?.[0];
  const participantNames = getParticipantNames(meeting.participants);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Meeting Details"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{meeting.title}</h2>
            {meeting.agenda && (
              <p className="text-muted-foreground">{meeting.agenda}</p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              meeting.status
            )}`}
          >
            {meeting.status.toUpperCase()}
          </span>
        </div>

        {firstSlot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(firstSlot.startTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(firstSlot.startTime)} - {formatTime(firstSlot.endTime)}
                  </p>
                </div>
              </div>

              {meeting.location && (
                <div className="flex items-center gap-3">
                  {meeting.isVirtual ? (
                    <Video className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">
                      {meeting.isVirtual ? "Meeting Link" : "Location"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {meeting.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {meeting.host && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Host</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof meeting.host === "string"
                        ? meeting.host
                        : (meeting.host as any)?.name || (meeting.host as any)?.email || "Unknown"}
                    </p>
                  </div>
                </div>
              )}

              {participantNames.length > 0 && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Participants</p>
                    <p className="text-sm text-muted-foreground">
                      {participantNames.join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {meeting.remarks && (
          <div className="pt-4 border-t">
            <p className="font-medium mb-2">Remarks</p>
            <p className="text-sm text-muted-foreground">{meeting.remarks}</p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}