import { AVAILABLE_COORDINATE_RANGE } from '../const';

/**
 * 座標が有効な範囲内のものかどうか
 * @param latitude 緯度
 * @param longitude 経度
 */
export const checkCoordinateAvailability = (latitude: number, longitude: number): boolean => {
  const [[north, west], [south, east]] = AVAILABLE_COORDINATE_RANGE;

  return (
    north >= latitude &&
    south <= latitude &&
    west <= longitude &&
    east >= longitude
  );
};
