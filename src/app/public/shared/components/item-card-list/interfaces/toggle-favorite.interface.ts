import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { LOGIN_SOURCE } from '@public/shared/components/item-card-list/enums/login-source.enum';

export interface ToggleFavoriteInterface {
  item: ItemCard;
  loginSource: LOGIN_SOURCE;
}
