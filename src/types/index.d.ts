import { shelters } from '../assets/shelters.json';

/** シェルターデータの型 */
export type Shelter = typeof shelters[number];

/** 中心座標 */
export type MapPosition = {
  latitude: number;
  longitude: number;
  zoom: number;
};
