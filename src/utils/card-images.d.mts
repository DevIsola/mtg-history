export type CardImageVersion = 'small' | 'normal' | 'large';
export function canonicalPrintingId(id: string): string;
export function cardImageUrlForPrinting(id: string, version?: CardImageVersion): string;
export function cardImageSrcsetForPrinting(id: string): string;
export const cardImageIntrinsicSize: Readonly<{ width: 488; height: 680 }>;
