import { useState, useCallback } from 'react';

/**
 * Custom hook for handling pull-to-refresh logic.
 * @param refetchFn - The async function to call when refreshing.
 * @returns An object containing the `refreshing` state and the `onRefresh` handler.
 */
export function useRefresh(refetchFn: () => Promise<any>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchFn();
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchFn]);

  return { refreshing, onRefresh };
}
