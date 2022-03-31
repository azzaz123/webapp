import { Image } from '@core/user/user-response.interface';
import { ItemCard, ItemCardsWithRecommenedType } from '@public/core/interfaces/item-card.interface';
import { RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import {
  RECOMMENDED_ITEM_IMAGE,
  RECOMMENDED_ITEM_MOCK,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { SearchPagination } from '@public/features/search/interfaces/search-pagination.interface';
import { ITEM_BUMP_FLAGS, ITEM_DATA, ITEM_DISTANCE, ITEM_SALE_CONDITIONS } from './item.fixtures.spec';
import { USER_ID } from './user.fixtures.spec';
import { SORT_BY, PaginatedList } from '@api/core/model';

export const MOCK_ITEM_CARD: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: USER_ID,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  images: [ITEM_DATA.main_image],
  flags: ITEM_DATA.flags,
  bumpFlags: ITEM_BUMP_FLAGS,
  webSlug: ITEM_DATA.web_slug,
  currencyCode: ITEM_DATA.currency_code,
  categoryId: ITEM_DATA.category_id,
  saleConditions: ITEM_SALE_CONDITIONS,
  distance: ITEM_DISTANCE,
};

export const MOCK_PAGINATED_CARD_LIST: PaginatedList<ItemCard> = {
  paginationParameter: 'paginationParameter',
  list: [MOCK_ITEM_CARD, MOCK_ITEM_CARD],
};

export const MOCK_RECOMMENDED_ITEM_CARD_IMAGE: Image = {
  ...RECOMMENDED_ITEM_IMAGE,
};

export const MOCK_RECOMMENDED_ITEM_CARD: ItemCard = {
  id: RECOMMENDED_ITEM_MOCK.id,
  categoryId: 100,
  ownerId: RECOMMENDED_ITEM_MOCK.user_id,
  title: RECOMMENDED_ITEM_MOCK.title,
  salePrice: RECOMMENDED_ITEM_MOCK.price.amount,
  images: [MOCK_RECOMMENDED_ITEM_CARD_IMAGE],
  webSlug: RECOMMENDED_ITEM_MOCK.slug,
  currencyCode: RECOMMENDED_ITEM_MOCK.price.currency,
  flags: {
    pending: false,
    sold: false,
    favorite: RECOMMENDED_ITEM_MOCK.favorited.flag,
    reserved: false,
    banned: false,
    expired: false,
  },
};

export const MOCK_RECOMMENDED_ITEM_CARD_NON_FAVOURITE: ItemCard = {
  ...MOCK_RECOMMENDED_ITEM_CARD,
  flags: {
    pending: false,
    sold: false,
    favorite: false,
    reserved: false,
    banned: false,
    expired: false,
  },
};

export const MOCK_RECOMMENDED_ITEM_CARD_WITHOUT_IMAGES: ItemCard = {
  ...MOCK_RECOMMENDED_ITEM_CARD,
  images: [],
};

export const MOCK_ITEM_CARDS_WITH_RECOMMENDED_TYPE: ItemCardsWithRecommenedType = {
  recommendedType: RECOMMENDER_TYPE.SOCIAL_MEDIA_RECOMMENDATION,
  recommendedItems: [MOCK_ITEM_CARD, MOCK_ITEM_CARD],
};

export const MOCK_EMPTY_ITEM_CARDS_WITH_RECOMMENDED_TYPE: ItemCardsWithRecommenedType = {
  recommendedType: RECOMMENDER_TYPE.SOCIAL_MEDIA_RECOMMENDATION,
  recommendedItems: [],
};

export function ItemCardListFactory(count: number = 20): ItemCard[] {
  return new Array(count).fill('').map((_, index) => ({ ...MOCK_ITEM_CARD, id: '235325' + index }));
}

export function SearchPaginationFactory(
  hasMore: boolean = false,
  searchId: string = '',
  sortBy: SORT_BY = SORT_BY.DISTANCE
): SearchPagination {
  return {
    items: ItemCardListFactory(40),
    hasMore,
    searchId,
    sortBy,
  };
}
