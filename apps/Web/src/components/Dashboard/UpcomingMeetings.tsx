import React from 'react';
import { Calendar, Clock, Users, MapPin, Video } from 'lucide-react';
import type { Meeting } from '@/types/meeting';

interface UpcomingMeetingsProps {
  meetings?: Meeting[];
  loading?: boolean;
}

export const UpcomingMeetings: React.FC<UpcomingMeetingsProps> = ({ meetings = [], loading }) => {
  // Ensure meetings is an array
  const meetingsArray = Array.isArray(meetings) ? meetings : [];
  
  // Filter upcoming meetings (scheduled status, future dates)
  const upcomingMeetings = meetingsArray
    .filter(meeting => {
      if (meeting.status !== 'scheduled') return false;
      if (!meeting.timeSlots || meeting.timeSlots.length === 0) return false;
      
      // Get the earliest time slot
      const earliestSlot = meeting.timeSlots[0];
      const slotDate = new Date(earliestSlot.startTime);
      return slotDate >= new Date();
    })
    .sort((a, b) => {
      const aTime = new Date(a.timeSlots[0].startTime).getTime();
      const bTime = new Date(b.timeSlots[0].startTime).getTime();
      return aTime - bTime;
    })
    .slice(0, 5); // Show only next 5 meetings

  if (loading) {
    return (
      <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6">
        <h3 className="font-semibold text-base sm:text-lg mb-4">Upcoming Meetings</h3>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base sm:text-lg">Upcoming Meetings</h3>
        {upcomingMeetings.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {upcomingMeetings.length} {upcomingMeetings.length === 1 ? 'meeting' : 'meetings'}
          </span>
        )}
      </div>

      {upcomingMeetings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No upcoming meetings scheduled</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {upcomingMeetings.map((meeting) => {
            const firstSlot = meeting.timeSlots[0];
            const startTime = new Date(firstSlot.startTime);
            const endTime = new Date(firstSlot.endTime);
            const dateStr = startTime.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            const timeStr = `${startTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })} - ${endTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}`;

            // Handle populated host/participants (could be object or string)
            const hostName = typeof meeting.host === 'object' && meeting.host?.name 
              ? meeting.host.name 
              : 'Meeting';
            const participantCount = Array.isArray(meeting.participants) 
              ? meeting.participants.length 
              : 0;

            return (
              <div
                key={meeting._id}
                className="border rounded-lg p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{meeting.title}</h4>
                    {meeting.agenda && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {meeting.agenda}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{dateStr}</span>
                    <Clock className="h-3 w-3 ml-2" />
                    <span>{timeStr}</span>
                  </div>

                  {meeting.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {meeting.isVirtual ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <MapPin className="h-3 w-3" />
                      )}
                      <span className="truncate">{meeting.location}</span>
                    </div>
                  )}

                  {participantCount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>
                        {participantCount}{' '}
                        {participantCount === 1 ? 'participant' : 'participants'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

