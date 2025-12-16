import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVisitsThunk } from "@/store/slices/visit.slice";

export const useVisits = () => {
    const dispatch = useAppDispatch();
    const { visits, loading, error } = useAppSelector((state) => state.visits);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    useEffect(() => {
        if (visits.length === 0)
            dispatch(fetchVisitsThunk({}));
    }, [dispatch, visits.length]);

    const filteredVisits = visits.filter((visit) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            visit.visitor.name.toLowerCase().includes(query) ||
            visit.host.name.toLowerCase().includes(query) ||
            visit.status.toLowerCase().includes(query);

        const matchesStatus = statusFilter ? visit.status === statusFilter : true;

        return matchesSearch && matchesStatus;
    });

    return {
        visits: filteredVisits,
        loading: loading === 'pending',
        error,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
    };
};
