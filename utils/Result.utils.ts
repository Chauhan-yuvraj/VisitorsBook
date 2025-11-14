import { Skia } from "@shopify/react-native-skia";

export const calculateTransform = (paths: any[], previewSize: number) => {
    if (!paths || paths.length === 0) return { scale: 1, offsetX: 0, offsetY: 0 };

    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    paths.forEach((pathData) => {
        const path = createSkPathFromSvg(pathData.svg);
        if (!path) return;

        const bounds = path.computeTightBounds();
        if (!bounds) return;

        minX = Math.min(minX, bounds.x);
        minY = Math.min(minY, bounds.y);
        maxX = Math.max(maxX, bounds.x + bounds.width);
        maxY = Math.max(maxY, bounds.y + bounds.height);
    });

    if (!isFinite(minX)) return { scale: 1, offsetX: 0, offsetY: 0 };

    const width = maxX - minX;
    const height = maxY - minY;

    // Add padding
    const padding = 10;
    const availableSize = previewSize - padding * 2;

    // Calculate scale to fit
    const scale = Math.min(availableSize / width, availableSize / height);

    // Center the drawing
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    const offsetX = (previewSize - scaledWidth) / 2 - minX * scale;
    const offsetY = (previewSize - scaledHeight) / 2 - minY * scale;

    return { scale, offsetX, offsetY };
};

export const createSkPathFromSvg = (svgString: string) => {
  return Skia.Path.MakeFromSVGString(svgString);
};


