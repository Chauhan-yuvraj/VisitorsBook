import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGuestsThunk } from "@/store/slices/guest.slice";
import { Visitor } from "@/store/types/visitor";

export function useVisitors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'ALL' | 'VIP' | 'WITH_COMPANY'>('ALL');
  const dispatch = useAppDispatch();

  const { guest: visitors, loading } = useAppSelector((s) => s.guest);

  useEffect(() => {
    if (visitors.length === 0)
      dispatch(fetchGuestsThunk());
  }, [dispatch, visitors.length]);

  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return visitors.filter((item: Visitor) => {
      if (!item) return false;

      const name = item.name?.toLowerCase() || "";
      const email = item.email?.toLowerCase() || "";
      const phone = item.phone?.toLowerCase() || "";
      const company = item.companyNameFallback?.toLowerCase() || "";

      const matchesSearch = name.includes(query) || email.includes(query) || phone.includes(query) || company.includes(query);

      let matchesFilter = true;
      if (filterType === 'VIP') {
        matchesFilter = true; // Placeholder if isVip is missing
      } else if (filterType === 'WITH_COMPANY') {
        matchesFilter = !!item.companyNameFallback;
      }

      return matchesSearch && matchesFilter;
    });
  }, [visitors, searchQuery, filterType]);

  return {
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    visitors: filteredData,
    loading,
  };
}
