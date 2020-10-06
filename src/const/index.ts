export const PAGES = {
  LANDING_PAGE: '/',
  MAP: '/map',
  MAP_MENU: '/map/menu',
  MAP_SHELTER: '/map/shelter/:shelterId',
};

/**
 * 有効な座標の範囲
 */
export const AVAILABLE_COORDINATE_RANGE = [
  [35.733313, 139.985326],
  [35.466086, 140.324025],
] as L.BoundsLiteral;
