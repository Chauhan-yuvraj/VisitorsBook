import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEmployeesThunk } from "@/store/slices/employees.slice";
import { Employee } from "@/store/types/user";

export function useEmployees() {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();

  const { employees, loading } = useAppSelector((s) => s.employees);

  useEffect(() => {
    dispatch(fetchEmployeesThunk());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return employees.filter((item: Employee) => {
      if (!item) return false;

      const name = item.name?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      const job = item.jobTitle?.toLowerCase() || "";

      return name.includes(query) || email.includes(query) || job.includes(query);
    });
  }, [employees, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    employees: filteredData,
    loading,
  };
}
