import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVisitors, deleteVisitor } from "@/store/slices/visitorSlice";
import type { Visitor } from "@/types/visitor";
import { UserRole } from "@/types/user";

export const useVisitors = () => {
  const dispatch = useAppDispatch();
  const { visitors, isLoading } = useAppSelector((state) => state.visitors);
  const { user, role } = useAppSelector((state) => state.auth);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  useEffect(() => {
    if (visitors.length === 0) {
      dispatch(fetchVisitors());
    }
  }, [dispatch, visitors.length]);

  const handleAddVisitor = () => {
    setSelectedVisitor(null);
    setIsModalOpen(true);
  };

  const handleVisitorClick = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setIsProfileModalOpen(true);
  };

  const handleEditFromProfile = (visitor: Visitor) => {
    setIsProfileModalOpen(false);
    setSelectedVisitor(visitor);
    setIsModalOpen(true);
  };

  const handleDeleteVisitor = async (visitorId: string) => {
    await dispatch(deleteVisitor(visitorId));
    setIsProfileModalOpen(false);
  };

  const filteredVisitors = useMemo(() => {
    let filtered = visitors.filter(
      (visitor) =>
        visitor &&
        (visitor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          visitor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          visitor.companyNameFallback?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Apply permission-based filtering
    if (role === UserRole.MANAGER && user?.departments) {
      const userDepartmentIds = Array.isArray(user.departments)
        ? user.departments.map(dept => typeof dept === 'string' ? dept : dept._id)
        : [];
      filtered = filtered.filter(visitor =>
        visitor.departments?.some(deptId => userDepartmentIds.includes(deptId))
      );
    }
    // For ADMIN and HR, show all (no additional filtering)
    // For EMPLOYEE, they shouldn't access this page, but if they do, show none
    if (role === UserRole.EMPLOYEE) {
      filtered = [];
    }

    return filtered;
  }, [visitors, searchQuery, role, user]);

  return {
    visitors: filteredVisitors,
    isLoading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    selectedVisitor,
    handleAddVisitor,
    handleVisitorClick,
    handleEditFromProfile,
    handleDeleteVisitor,
  };
};
