import { UserId } from '../../shared/domain/user-id';
import { UserImage } from './user-image';

export interface User {
  id: UserId;
  microName: string;
  image: UserImage;
}
