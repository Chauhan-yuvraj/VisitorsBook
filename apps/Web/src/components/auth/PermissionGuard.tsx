import { usePermission } from "@/hooks/auth/usePermission";

interface Props {
  permission: string | string[];
  mode?: "any" | "all";
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({
  permission,
  mode = "any",
  children,
  fallback = null,
}: Props) => {
  const { hasPermission } = usePermission();

  const permissions = Array.isArray(permission)
    ? permission
    : [permission];

  const isAllowed =
    mode === "all"
      ? permissions.every((p) => hasPermission(p))
      : permissions.some((p) => hasPermission(p));

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
