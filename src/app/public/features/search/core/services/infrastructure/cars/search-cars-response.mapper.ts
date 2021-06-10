import { translations } from '@core/i18n/translations/constants/translations';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { SearchResponse } from '../api/search-response.interface';
import { SearchItemImageMapper } from '../models/search-item-image-mapper.response';
import { SearchCarResponse, SearchItemCarResponse } from './search-car-response';

export function SearchItemCarResponseMapper({ search_objects }: SearchResponse<SearchCarResponse>): ItemCard[] {
  return search_objects.map(({ id, content }: SearchCarResponse) => ({
    id,
    title: content.title,
    description: content.storytelling,
    salePrice: content.price,
    currencyCode: content.currency,
    distance: content.distance,
    ownerId: content.user.id,
    webSlug: content.web_slug,
    images: content.images.map(SearchItemImageMapper),
    flags: {
      pending: content.flags.pending,
      sold: content.flags.sold,
      favorite: false,
      reserved: content.flags.reserved,
      banned: content.flags.banned,
      expired: content.flags.expired,
      onhold: content.flags.onhold
    },
    bumpFlags: {
      bumped: content.visibility_flags.bumped,
      highlighted: content.visibility_flags.highlighted,
      urgent: content.visibility_flags.urgent,
      country_bumped: content.visibility_flags.country_bumped,
      boosted: content.visibility_flags.boosted
    },
    categoryId: content.category_id,
    saleConditions: null,
    specs: SearchItemCarSpecsMapper(content)
  }));
}

export function SearchItemCarSpecsMapper(content: SearchItemCarResponse): string[] {
  const specs: string[] = [];
  const { engine, gearbox, horsepower, year, km } = content;

  if (engine) {
    const translationKey = engine.toLowerCase();

    specs.push(getCarsSpecTranslation(translationKey));
  }
  if (gearbox) {
    specs.push(getCarsSpecTranslation(gearbox));
  }
  if (horsepower) {
    specs.push(`${horsepower} cv`);
  }
  if (year) {
    specs.push(`${year}`);
  }
  if (km) {
    specs.push(`${km} km`);
  }
  return specs;
}

export function getCarsSpecTranslation(translationKey: string) {
  return translations[translationKey] || '';
}

