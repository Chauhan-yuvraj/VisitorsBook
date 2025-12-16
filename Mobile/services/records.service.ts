import { FeedbackRecord } from "@/store/types/feedback";
import API from "./api";

export async function getRecordsFromAPI(): Promise<FeedbackRecord[]> {
    console.log("Making an APi call to get all records")
    try {
        const response = await API.get("/records", {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response.data)

        return response.data;
    }
    catch (e) {
        console.error("Failed to fetch records from API:", e);
        throw e;
    }

}


export async function deleteRecordFromAPI(id: string): Promise<void> {
    try {
        await API.delete(`/records/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (e) {
        console.error("Failed to delete record from API:", e);
        throw e;
    }
}