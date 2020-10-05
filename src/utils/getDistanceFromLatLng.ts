export const RADIUS_OF_THE_EARTH = 6_371_000;

/**
 * 緯度経度から距離（m）を計算する
 * @param latlng1 緯度経度
 * @param latlng2 緯度経度
 */
export const getDistanceFromLatLng = (latlng1: [number, number], latlng2: [number, number]): number => {
  const lat1 = latlng1[0] * Math.PI / 180;
  const lng1 = latlng1[1] * Math.PI / 180;
  const lat2 = latlng2[0] * Math.PI / 180;
  const lng2 = latlng2[1] * Math.PI / 180;

  return RADIUS_OF_THE_EARTH * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
};
