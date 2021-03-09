import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { ITEM_CELLPHONES_EXTRA_INFO, ITEM_FASHION_EXTRA_INFO } from '@fixtures/item.fixtures.spec';

export const MOCK_CELLPHONE_EXTRA_INFO = capitalizeLabels([ITEM_CELLPHONES_EXTRA_INFO.brand, ITEM_CELLPHONES_EXTRA_INFO.model]);
export const MOCK_FASHION_EXTRA_INFO = capitalizeLabels([
  ITEM_FASHION_EXTRA_INFO.size.text,
  ITEM_FASHION_EXTRA_INFO.brand,
  ITEM_FASHION_EXTRA_INFO.model,
  ITEM_FASHION_EXTRA_INFO.condition,
]);
export const MOCK_CAR_EXTRA_INFO = capitalizeLabels([MOCK_CAR.version, MOCK_CAR.year.toString(), `${MOCK_CAR.km}Km`]);

function capitalizeLabels(labels: string[]): string[] {
  return labels.map((label) => label.charAt(0).toUpperCase() + label.substr(1));
}
