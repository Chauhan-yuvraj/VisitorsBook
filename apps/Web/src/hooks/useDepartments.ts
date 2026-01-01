import { useState, useEffect } from "react";
import { getDepartments } from "@/services/department.service";
import type { IDepartment } from "@repo/types";

export const useDepartments = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch departments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return {
    departments,
    isLoading,
    error,
    refetch: () => {
      const fetchDepartments = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getDepartments();
          setDepartments(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to fetch departments");
        } finally {
          setIsLoading(false);
        }
      };
      fetchDepartments();
    }
  };
};