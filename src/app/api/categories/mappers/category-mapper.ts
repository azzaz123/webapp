import { CategoryDto } from '../dtos';
import { CategoryResponse } from '@core/category/category-response.interface';
import { CategoriesFilterOption } from '@public/shared/components/filters/components/categories-filter/interfaces/categories-filter-option.interface';
import { CATEGORY_ICONS } from '@public/shared/components/filters/components/categories-filter/data/category_options';

export function mapCategoriesToUploadCategories(categories: CategoryDto[]): CategoryResponse[] {
  return categories.map((category) => mapCategoryToUploadCategory(category));
}

function mapCategoryToUploadCategory(category: CategoryDto): CategoryResponse {
  const { category_id, name, icon_id, vertical_id, fields, hasShipping } = category;

  return {
    category_id,
    name,
    icon_id,
    vertical_id,
    fields,
    hasShipping,
  };
}

export function mapCategoriesToSearchCategories(categories: CategoryDto[]): CategoriesFilterOption[] {
  return categories.map((category) => mapCategoryToSearchCategory(category));
}

function mapCategoryToSearchCategory(category: CategoryDto): CategoriesFilterOption {
  const { category_id, name, icon_id } = category;

  return {
    value: category_id.toString(),
    label: name,
    icon: CATEGORY_ICONS.find((categoryIcon) => categoryIcon.id === icon_id),
  };
}
