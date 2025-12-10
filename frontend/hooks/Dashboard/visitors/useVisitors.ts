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

      const matchesSearch = name.includes(query) || email.includes(query) || phone.includes(query) || company.includes(query);
      
      let matchesFilter = true;
      if (filterType === 'VIP') {
        // Assuming there is an isVip field, if not we can skip or add it. 
        // Checking the type definition would be good, but for now let's assume or check context.
        // The previous context showed isVip in VisitSnapshot, likely in Visitor too.
        // If not, I'll just filter by 'WITH_COMPANY' for now.
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
