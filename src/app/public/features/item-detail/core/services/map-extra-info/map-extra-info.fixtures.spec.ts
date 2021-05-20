import { capitalizeString } from '@core/helpers/capitalize-string/capitalize-string';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { ITEM_CELLPHONES_EXTRA_INFO, ITEM_FASHION_EXTRA_INFO, ITEM_GENERIC_EXTRA_INFO } from '@fixtures/item.fixtures.spec';

export const MOCK_CELLPHONE_EXTRA_INFO_LABELS = [ITEM_CELLPHONES_EXTRA_INFO.brand, ITEM_CELLPHONES_EXTRA_INFO.model].map((string) =>
  capitalizeString(string)
);

export const MOCK_FASHION_EXTRA_INFO_LABELS = [
  ITEM_FASHION_EXTRA_INFO.size.text,
  ITEM_FASHION_EXTRA_INFO.brand,
  ITEM_FASHION_EXTRA_INFO.model,
  ITEM_FASHION_EXTRA_INFO.condition,
].map((string) => capitalizeString(string));

export const MOCK_CAR_EXTRA_INFO_LABELS = [MOCK_CAR.version, MOCK_CAR.year.toString(), `${MOCK_CAR.km}Km`].map((string) =>
  capitalizeString(string)
);
