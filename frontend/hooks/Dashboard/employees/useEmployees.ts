import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEmployeesThunk } from "@/store/slices/employees.slice";
import { Employee } from "@/store/types/user";

export function useEmployees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { employees, loading } = useAppSelector((s) => s.employees);

  useEffect(() => {
    if (employees.length === 0)
      dispatch(fetchEmployeesThunk());
  }, [dispatch, employees.length]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return employees.filter((item: Employee) => {
      if (!item) return false;

      const name = item.name?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      const job = item.jobTitle?.toLowerCase() || "";

      const matchesSearch = name.includes(query) || email.includes(query) || job.includes(query);
      const matchesRole = filterRole ? item.role === filterRole : true;

      return matchesSearch && matchesRole;
    });
  }, [employees, searchQuery, filterRole]);

  const refetch = () => dispatch(fetchEmployeesThunk());

  return {
    searchQuery,
    setSearchQuery,
    filterRole,
    setFilterRole,
    employees: filteredData,
    loading,
    refetch,
  };
}
