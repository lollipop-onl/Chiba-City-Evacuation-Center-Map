import { shelters } from '../assets/shelters.json';

/** シェルターデータの型 */
export type Shelter = typeof shelters[number];

/** ユーザーの現在位置 */
export type PresentLocation = {
  latitude: number;
  longitude: number;
  heading: number | null;
};
