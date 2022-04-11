import { Location, LocationWithRadius } from '@api/core/model';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { MOCK_CARRIER_OFFICE_INFO } from '../carrier-office-info/carrier-office-info.fixtures.spec';

export const MOCK_LOCATION: Location = {
  latitude: 2.39239,
  longitude: 3.948934,
};

export const MOCK_LOCATION_2: Location = {
  latitude: 6.54545,
  longitude: 4.6666,
};

export const MOCK_FULL_ADDRESS: string = 'This is a full address';

export const MOCK_LOCATION_WITH_RADIUS: LocationWithRadius = {
  ...MOCK_LOCATION,
  radiusInKm: 2,
};

export const MOCK_OFFICE_MARKERS: Location[] = [
  {
    latitude: MOCK_CARRIER_OFFICE_INFO.latitude,
    longitude: MOCK_CARRIER_OFFICE_INFO.longitude,
  },
];

export const MOCK_FALLBACK_LOCATION: Location = {
  latitude: +DEFAULT_LOCATIONS['en'].latitude,
  longitude: +DEFAULT_LOCATIONS['en'].longitude,
};

export const MOCK_FALLBACK_LOCATION_WITH_RADIUS: LocationWithRadius = {
  ...MOCK_FALLBACK_LOCATION,
  radiusInKm: 1,
};

export const MOCK_USER_LOCATION: Location = {
  latitude: MOCK_USER.location.approximated_latitude,
  longitude: MOCK_USER.location.approximated_longitude,
};

export const MOCK_USER_LOCATION_WITH_RADIUS: LocationWithRadius = {
  ...MOCK_USER_LOCATION,
  radiusInKm: 2,
};

export const MOCK_CARRIER_OFFICE_INFO_LOCATION: Location = {
  latitude: MOCK_CARRIER_OFFICE_INFO.latitude,
  longitude: MOCK_CARRIER_OFFICE_INFO.longitude,
};
