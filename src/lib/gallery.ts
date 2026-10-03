export type GalleryPhoto = {
  /** Import ES6 al fotografiei originale (JPG), fără prelucrări. */
  src: string;
  alt: string;
};

/**
 * Fotografiile reale LittleToscana. Se completează cu imaginile originale
 * furnizate de proprietar; nu se folosesc imagini generate sau stock.
 */
export const galleryPhotos: GalleryPhoto[] = [
  { src: "/images/littletoscana/IMG_1126.jpg", alt: "LittleToscana, cabana și piscina pe teritoriul privat" },
  { src: "/images/littletoscana/IMG_1146.jpg", alt: "Curtea LittleToscana cu cabana și zona de relaxare" },
  { src: "/images/littletoscana/IMG_1132.jpg", alt: "Foișorul și zona de foc de la LittleToscana" },
  { src: "/images/littletoscana/IMG_1179.jpg", alt: "Piscina și priveliștea de la LittleToscana la apus" },
  { src: "/images/littletoscana/IMG_1144.jpg", alt: "Cabana LittleToscana văzută din grădină" },
  { src: "/images/littletoscana/IMG_1125.jpg", alt: "Cabana LittleToscana reflectată în piscină" },
  { src: "/images/littletoscana/IMG_1134.jpg", alt: "Zona de relaxare și piscina LittleToscana" },
  { src: "/images/littletoscana/IMG_1147.jpg", alt: "Grădina și zonele de odihnă LittleToscana" },
  { src: "/images/littletoscana/IMG_1143.jpg", alt: "Cabana LittleToscana în lumina serii" },
  { src: "/images/littletoscana/IMG_1118.jpg", alt: "Șezlongurile de lângă piscina LittleToscana" },
  { src: "/images/littletoscana/IMG_1161.jpg", alt: "Cabana LittleToscana iluminată seara" },
  { src: "/images/littletoscana/IMG_1182.jpg", alt: "Detaliu din sauna LittleToscana" },
];
