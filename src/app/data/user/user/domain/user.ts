import { UserId } from '../../shared/domain/user-id';
import { UserGender } from './user-gender';
import { UserImage } from './user-image';

export interface User {
  id: UserId;
  microName: string;
  image: UserImage;
  firstName: string;
  lastName: string;
  birthDate: number;
  gender: UserGender;
  email: string;
}
