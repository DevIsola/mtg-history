export interface CardArtworkViewerInput {
  id: string;
  name: string;
  artist: string;
  setCode: string;
  collectorNumber: string;
  significance?: string;
}
export interface CardArtworkViewerModel {
  printingId: string;
  title: string;
  alt: string;
  attribution: string;
  significance: string;
  imageUrl: string;
  imageSrcset: string;
  cardUrl: string;
}
export function buildCardArtworkViewerModel(input: CardArtworkViewerInput): CardArtworkViewerModel;
export function shouldAnimateCardArtwork(input: {
  reducedMotion: boolean;
  supported: boolean;
  sourceLoaded: boolean;
}): boolean;
