export type Guest = {
    // The ID is crucial for identifying the item for updates and deletions
    id?: string;
    name: string,
    position: string;
    img: string
}