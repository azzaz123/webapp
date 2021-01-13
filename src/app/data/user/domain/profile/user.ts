import { UserGender } from './user-gender';
import { UserId } from './user-id';
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
