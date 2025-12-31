import React from "react";
import { Calendar, Clock, Users, MapPin, Video, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Meeting } from "@/types/meeting";

interface MeetingsGridProps {
  meetings: Meeting[];
  onEdit?: (meeting: Meeting) => void;
  onDelete?: (id: string) => void;
}

export const MeetingsGrid: React.FC<MeetingsGridProps> = ({
  meetings,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter and sort meetings - show upcoming first, then past
  const sortedMeetings = [...meetings].sort((a, b) => {
    if (!a.timeSlots || a.timeSlots.length === 0) return 1;
    if (!b.timeSlots || b.timeSlots.length === 0) return -1;
    
    const aTime = new Date(a.timeSlots[0].startTime).getTime();
    const bTime = new Date(b.timeSlots[0].startTime).getTime();
    return aTime - bTime;
  });

  if (sortedMeetings.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No meetings found</p>
        <p className="text-sm mt-2">Schedule a meeting to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedMeetings.map((meeting) => {
        const firstSlot = meeting.timeSlots?.[0];
        if (!firstSlot) return null;

        const startTime = new Date(firstSlot.startTime);
        const isUpcoming = startTime >= new Date();

        // Handle populated participants (could be object or string)
        const participantCount = Array.isArray(meeting.participants) 
          ? meeting.participants.length 
          : 0;

        return (
          <div 
            key={meeting._id} 
            className={`bg-card text-card-foreground rounded-xl border shadow-sm p-6 ${
              isUpcoming ? 'border-primary/20' : 'opacity-75'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 truncate">{meeting.title}</h3>
                {meeting.agenda && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meeting.agenda}
                  </p>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 shrink-0 ${getStatusColor(meeting.status)}`}>
                {meeting.status.toUpperCase()}
              </span>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{formatDate(firstSlot.startTime)}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>
                  {formatTime(firstSlot.startTime)} - {formatTime(firstSlot.endTime)}
                </span>
              </div>

              {meeting.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  {meeting.isVirtual ? (
                    <Video className="h-4 w-4 shrink-0" />
                  ) : (
                    <MapPin className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate">{meeting.location}</span>
                </div>
              )}

              {participantCount > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>
                    {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
                  </span>
                </div>
              )}

              {meeting.remarks && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    <span className="font-medium">Remarks: </span>
                    {meeting.remarks}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => onEdit(meeting)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => meeting._id && onDelete(meeting._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

