// src/utils/serializationUtils.ts

import { PathData } from "@/components/SignatureCanvas";
import { CanvasPage } from "@/components/ui/DrawingCanavs";
import { SerializableCanvasPage, SerializablePathData } from "@/store/types/feedback";

// (assuming they exist on the PathData object runtime)
export const serializesPath = (rawPathData: PathData): SerializablePathData | null => {
    // Type casting helps TS recognize runtime properties like color and strokeWidth
    const pathWithMetadata = rawPathData as (PathData & { color: string, strokeWidth: number });

    if (!rawPathData || !rawPathData.path || typeof rawPathData.path.toSVGString !== "function") {
        return null;
    }
    try {
        return {
            svg: pathWithMetadata.path.toSVGString(),
            color: pathWithMetadata.color,
            strokeWidth: pathWithMetadata.strokeWidth,
        };
    } catch (error) {
        console.error("Error serializing PathData:", error);
        return null;
    }
}


// Fixes Error 3 by ensuring the final map output matches SerializableCanvasPage[]
export const serializesCanvasPages = (rawCanvasPages: CanvasPage[]): SerializableCanvasPage[] => {

    if (!rawCanvasPages) {
        return [];
    }

    return rawCanvasPages.map(rawPage => {

        const serializedPaths: SerializablePathData[] = rawPage.paths
            .map(serializesPath)
            .filter((p): p is SerializablePathData => p !== null);

        return {
            id: rawPage.id,
            paths: serializedPaths,
        }
    })
}

export const deserializeRouterParam = <T>(param: string | string[] | undefined): T[] => {
    if (!param || Array.isArray(param)) {
        return [];
    }
    try {
        return JSON.parse(param) as T[];
    } catch (e) {
        console.error("Error parsing router parameter:", e);
        return [];
    }
};