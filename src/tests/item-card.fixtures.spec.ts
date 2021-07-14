import { Image } from '@core/user/user-response.interface';
import { ItemCard, ItemCardsWithRecommenedType } from '@public/core/interfaces/item-card.interface';
import { RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { RECOMMENDED_ITEM_MOCK } from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { SearchPagination } from '@public/features/search/interfaces/search-pagination.interface';
import {
  ITEM_BUMP_FLAGS,
  ITEM_DATA,
  ITEM_DISTANCE,
  ITEM_SALE_CONDITIONS,
  MOCK_ITEM_RESPONSE,
  MOCK_ITEM_RESPONSE_FAVOURITED,
} from './item.fixtures.spec';
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
export const MOCK_PUBLISHED_ITEM_CARD_IMAGE: Image = {
  id: '1213',
  original_width: MOCK_ITEM_RESPONSE.content.image?.original_width || null,
  original_height: MOCK_ITEM_RESPONSE.content.image?.original_height || null,
  average_hex_color: '',
  urls_by_size: MOCK_ITEM_RESPONSE.content.image,
};

export const MOCK_PUBLISHED_ITEM_CARD: ItemCard = {
  id: MOCK_ITEM_RESPONSE.id,
  ownerId: MOCK_ITEM_RESPONSE.content.user.id,
  title: MOCK_ITEM_RESPONSE.content.title,
  description: MOCK_ITEM_RESPONSE.content.description,
  salePrice: MOCK_ITEM_RESPONSE.content.price,
  images: MOCK_ITEM_RESPONSE.content.images,
  flags: MOCK_ITEM_RESPONSE.content.flags,
  bumpFlags: MOCK_ITEM_RESPONSE.content.visibility_flags,
  webSlug: MOCK_ITEM_RESPONSE.content.web_slug,
  currencyCode: MOCK_ITEM_RESPONSE.content.currency,
};

export const MOCK_PUBLISHED_ITEM_CARD_FAVOURITED: ItemCard = {
  id: MOCK_ITEM_RESPONSE_FAVOURITED.id,
  ownerId: MOCK_ITEM_RESPONSE_FAVOURITED.content.user.id,
  title: MOCK_ITEM_RESPONSE_FAVOURITED.content.title,
  description: MOCK_ITEM_RESPONSE_FAVOURITED.content.description,
  salePrice: MOCK_ITEM_RESPONSE_FAVOURITED.content.price,
  images: MOCK_ITEM_RESPONSE_FAVOURITED.content.images,
  flags: MOCK_ITEM_RESPONSE_FAVOURITED.content.flags,
  bumpFlags: MOCK_ITEM_RESPONSE_FAVOURITED.content.visibility_flags,
  webSlug: MOCK_ITEM_RESPONSE_FAVOURITED.content.web_slug,
  currencyCode: MOCK_ITEM_RESPONSE_FAVOURITED.content.currency,
};

export const MOCK_PUBLISHED_ITEM_CARD_WITHOUT_IMAGES: ItemCard = {
  id: MOCK_ITEM_RESPONSE.id,
  ownerId: MOCK_ITEM_RESPONSE.content.user.id,
  title: MOCK_ITEM_RESPONSE.content.title,
  description: MOCK_ITEM_RESPONSE.content.description,
  salePrice: MOCK_ITEM_RESPONSE.content.price,
  images: [MOCK_PUBLISHED_ITEM_CARD_IMAGE],
  flags: MOCK_ITEM_RESPONSE.content.flags,
  bumpFlags: MOCK_ITEM_RESPONSE.content.visibility_flags,
  webSlug: MOCK_ITEM_RESPONSE.content.web_slug,
  currencyCode: MOCK_ITEM_RESPONSE.content.currency,
};

export const MOCK_RECOMMENDED_ITEM_CARD_IMAGE: Image = {
  id: '1213',
  original_width: RECOMMENDED_ITEM_MOCK.images[0].original_width,
  original_height: RECOMMENDED_ITEM_MOCK.images[0].original_height,
  average_hex_color: '',
  urls_by_size: {
    original: RECOMMENDED_ITEM_MOCK.images[0].original,
    small: RECOMMENDED_ITEM_MOCK.images[0].small,
    large: RECOMMENDED_ITEM_MOCK.images[0].large,
    medium: RECOMMENDED_ITEM_MOCK.images[0].medium,
    xlarge: RECOMMENDED_ITEM_MOCK.images[0].xlarge,
  },
};

export const MOCK_RECOMMENDED_ITEM_CARD: ItemCard = {
  id: RECOMMENDED_ITEM_MOCK.id,
  ownerId: RECOMMENDED_ITEM_MOCK.seller_id,
  title: RECOMMENDED_ITEM_MOCK.title,
  salePrice: RECOMMENDED_ITEM_MOCK.price,
  images: [MOCK_RECOMMENDED_ITEM_CARD_IMAGE],
  webSlug: RECOMMENDED_ITEM_MOCK.web_slug,
  currencyCode: RECOMMENDED_ITEM_MOCK.currency,
  flags: {
    pending: false,
    sold: false,
    favorite: RECOMMENDED_ITEM_MOCK.favorited,
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
