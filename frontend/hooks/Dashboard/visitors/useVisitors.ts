import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGuestsThunk } from "@/store/slices/guest.slice";
import { Visitor } from "@/store/types/visitor";

export function useVisitors() {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useAppDispatch();

  const { guest: visitors, loading } = useAppSelector((s) => s.guest);

  useEffect(() => {
    dispatch(fetchGuestsThunk());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return visitors.filter((item: Visitor) => {
      if (!item) return false;

      const name = item.name?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      const phone = item.phone?.toLowerCase() || "";
      const company = item.companyNameFallback?.toLowerCase() || "";

      return name.includes(query) || email.includes(query) || phone.includes(query) || company.includes(query);
    });
  }, [visitors, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    visitors: filteredData,
    loading,
  };
}
