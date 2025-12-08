export const getStatusColor = (isActive: boolean) =>
  isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

export const getStatusLabel = (isActive: boolean) =>
  isActive ? "Active" : "Inactive";

export const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};
