import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchVisitsThunk } from "@/store/slices/visit.slice";

export const useVisits = () => {
    const dispatch = useAppDispatch();
    const { visits, loading, error } = useAppSelector((state) => state.visits);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        dispatch(fetchVisitsThunk({}));
    }, [dispatch]);

    const filteredVisits = visits.filter((visit) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            visit.visitor.name.toLowerCase().includes(query) ||
            visit.host.name.toLowerCase().includes(query) ||
            visit.status.toLowerCase().includes(query);

        const matchesStatus = statusFilter ? visit.status === statusFilter : true;

        let matchesDate = true;
        if (startDate) {
            const visitDate = new Date(visit.scheduledCheckIn);
            const vTime = visitDate.getTime();

            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const startTime = start.getTime();

            let endTime;
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                endTime = end.getTime();
            } else {
                const end = new Date(startDate);
                end.setHours(23, 59, 59, 999);
                endTime = end.getTime();
            }

            matchesDate = vTime >= startTime && vTime <= endTime;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    const refetch = () => dispatch(fetchVisitsThunk({}));

    return {
        visits: filteredVisits,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        refetch,
    };
};
