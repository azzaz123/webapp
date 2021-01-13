
import { Profile, UserGender, UserImage, UserLocation } from '../domain';
import { ApiImage, ApiUserResponse } from './api-user.response';


export class ApiUserMapper {
  static toDomain(apiUser: ApiUserResponse): Profile {
    return {
      id: '',
      microName: apiUser.micro_name,
      image: ApiUserImageMapper.toDomain(apiUser.image),
      firstName: apiUser.first_name,
      lastName: apiUser.last_name,
      birthDate: apiUser.birth_date,
      gender: apiUser.gender as UserGender,
      email: apiUser.email
    };
  }
}

export class ApiUserImageMapper {
  static toDomain(apiImage: ApiImage): UserImage {
    return {
      average_hex_color: apiImage.average_hex_color,
      id: apiImage.id,
      original_height: apiImage.original_height,
      original_width: apiImage.original_width,
      urls_by_size: {
        original: apiImage.urls_by_size.original,
        small: apiImage.urls_by_size.small,
        medium: apiImage.urls_by_size.medium,
        large: apiImage.urls_by_size.large,
        xlarge: apiImage.urls_by_size.xlarge,
        xmall: apiImage.urls_by_size.small
      }
    };
  }
}

export class ApiUserLocationMapper {
  static toDomain( {location}: ApiUserResponse): UserLocation {
    return {
      ...location
    };
  }
}
