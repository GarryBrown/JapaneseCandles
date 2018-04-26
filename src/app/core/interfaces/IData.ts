export interface OriginData {
  id: number;
  s: string;
  c: number[];
  h: number[];
  l: number[];
  o: number[];
  t: number[];
  v: number[];
}

export interface ItemData {
  c: number;
  h: number;
  l: number;
  o: number;
  t: number;
  v: number;
}

export interface DrawerConfig {
  widthItem: number;
  per: number;
  perPX: number;
  marginRight: number;
  zoom: number;
  offsetY: number;
}
