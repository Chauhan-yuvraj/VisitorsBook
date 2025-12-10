export const getVisitorStatusColor = (isBlocked: boolean) =>
  isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";

export const getVisitorStatusLabel = (isBlocked: boolean) =>
  isBlocked ? "Blocked" : "Active";

export const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};
