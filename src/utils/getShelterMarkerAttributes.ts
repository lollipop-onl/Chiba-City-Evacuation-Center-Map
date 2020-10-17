import { Shelter } from "../types";

/**
 * 避難所マーカーの属性値を返す
 * @param shelter 避難所情報
 */
export const getShelterMarkerAttributes = (shelter: Shelter): string => {
  const attributes: Record<string, string | number | boolean> = {
    'data-id': shelter.id,
    'data-supported-flood': shelter.support.flood >= 1,
    'data-supported-sedimentDisaster': shelter.support.sedimentDisaster >= 1,
    'data-supported-stormSurge': shelter.support.stormSurge >= 1,
    'data-supported-earthquake': shelter.support.earthquake >= 1,
    'data-supported-tsunami': shelter.support.tsunami >= 1,
    'data-supported-largeScaleFire': shelter.support.largeScaleFire >= 1,
    'data-supported-internalWaterFlood': shelter.support.internalWaterFlood >= 1,
    'data-supported-volcano': shelter.support.volcano >= 1,
    'data-category-evacuationArea': shelter.category.evacuationArea,
    'data-category-shelter': shelter.category.shelter,
    'data-category-wideAreaShelter': shelter.category.wideAreaShelter,
    'data-category-tsunamiRefugeBuilding': shelter.category.tsunamiRefugeBuilding,
  };

  return Object.entries(attributes).map((attr) => attr.join('=')).join(' ');
};
