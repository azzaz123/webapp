import { UserGender } from './user-gender';

export interface UserUpdate {
  first_name: string;
  last_name: string;
  language_id: string;
  birth_date: string;
  gender: UserGender;
}
