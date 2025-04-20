// In your custom .d.ts file (e.g., qrcode.react.d.ts or global.d.ts)

declare module 'qrcode.react' {
    // Define the props interface (ensure it matches the actual library props)
    interface QRCodeProps {
        value: string;
        size?: number;
        bgColor?: string;
        fgColor?: string;
        level?: 'L' | 'M' | 'Q' | 'H';
        includeMargin?: boolean;
        imageSettings?: {
            src: string;
            x?: number;
            y?: number;
            height: number;
            width: number;
            excavate?: boolean;
        };
        // Add any other props the library supports
        [key: string]: any; // Allow other props if needed, or be more specific
    }

    // Export the Canvas component by name
    export const QRCodeCanvas: React.FC<QRCodeProps>;

    // Export the SVG component by name (props are usually the same)
    export const QRCodeSVG: React.FC<QRCodeProps>;

    // Remove the incorrect default export declaration
    // export default QRCode;
}