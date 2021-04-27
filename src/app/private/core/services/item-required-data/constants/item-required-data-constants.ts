import { CATEGORY_IDS } from '@core/category/category-ids';

export const COMMON_REQUIRED_FIELDS = ['category_id', 'images', 'title', 'description', 'sale_price', 'currency_code'];
export const CATEGORY_IDS_WITH_REQUIRED_SECOND_LEVEL_OBJECT_TYPE = [CATEGORY_IDS.CELL_PHONES_ACCESSORIES, CATEGORY_IDS.FASHION_ACCESSORIES];

export const ITEM_REQUIRED_FIELDS_BY_CATEGORY_ID = {
  [CATEGORY_IDS.AGRICULTURE_INDUSTRIAL]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.APPLIANCES]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.BABIES_CHILD]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.BIKES]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.CAR]: [...COMMON_REQUIRED_FIELDS, 'model', 'brand', 'year', 'version'],
  [CATEGORY_IDS.CELL_PHONES_ACCESSORIES]: [...COMMON_REQUIRED_FIELDS, 'extra_info.object_type.id', 'extra_info.brand'],
  [CATEGORY_IDS.COLLECTIBLES_ART]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.COMPUTERS_ELECTRONICS]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.CONSTRUCTION]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.FASHION_ACCESSORIES]: [...COMMON_REQUIRED_FIELDS, 'extra_info.object_type.id', 'extra_info.brand', 'extra_info.gender'],
  [CATEGORY_IDS.GAMES_BOOKS]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.GAMES_CONSOLES]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.HOME_GARDEN]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.JOBS]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.MOTORBIKE]: [...COMMON_REQUIRED_FIELDS],
  [CATEGORY_IDS.MOTOR_ACCESSORIES]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.OTHERS]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.REAL_ESTATE]: [
    ...COMMON_REQUIRED_FIELDS,
    'condition',
    'type',
    'operation',
    'storytelling',
    'location.address',
    'location.latitude',
    'location.longitude',
  ],
  [CATEGORY_IDS.SERVICES]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.SPORTS_LEISURE]: COMMON_REQUIRED_FIELDS,
  [CATEGORY_IDS.TV_AUDIO_CAMERAS]: COMMON_REQUIRED_FIELDS,
};
