import { Model } from '../resource/model.interface';
import { ProfileImage } from './profile-response.interface';

export const FAKE_ITEM_IMAGE_SMALL_BASE_PATH = '../../../assets/images/fake-item-s.png';
export const FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH = '../../../assets/images/fake-item-s-l.png';

export class Profile implements Model {
  constructor(
    private _id: string,
    private _item_images: ProfileImage[],
    private _micro_name: string,
    private _num_total_items: number,
    private _scoring_stars: number,
    private _user_image: ProfileImage,
    private _favorited: boolean,
    private _is_professional: boolean,
    private _screen_name: string
  ) {}

  get id(): string {
    return this._id;
  }

  get item_images(): any {
    return this._item_images;
  }

  get micro_name(): any {
    return this._micro_name;
  }

  get num_total_items(): any {
    return this._num_total_items;
  }

  get scoring_stars(): any {
    return this._scoring_stars;
  }

  get user_image(): any {
    return this._user_image;
  }

  get favorited(): any {
    return this._favorited;
  }

  set favorited(value: any) {
    this._favorited = value;
  }

  get is_professional(): any {
    return this._is_professional;
  }

  get screen_name(): any {
    return this._screen_name;
  }
}
