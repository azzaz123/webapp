import { Coordinate } from '@core/geolocation/address-response.interface';
import { ItemPlace } from '@core/geolocation/geolocation-response.interface';
import { CoordinateMother } from './coordinate.mother';

export class MockGeolocationService {
  constructor() {}

  public search(query: string) {}
  public geocode(placeId: string) {}
  public reverseGeocode(latitude: string, longitude: string) {}
}

export const MOCK_LOCATION_SUGGESTIONS: ItemPlace[] = [
  { placeId: 'NT_FLG4U49nmbWReb1E0TQC6B', description: 'Espanya, Rubí' },
  { placeId: 'NT_0cWx5JH.H1PzROeWyK6r2D', description: 'Espanya, Font-rubí' },
  { placeId: 'NT_88QVcMdbsVTqeXysKhjSaB', description: 'Espanya, Rubí, Avinguda de Rubí' },
  { placeId: 'NT_FS-iNVl476JJoBaeOnjZeC', description: 'Espanya, Rubí de Bracamonte' },
  { placeId: 'NT_TDOpKKmckQGoBE9PDLgrKC', description: 'Espanya, Pontevedra, Avenida General Antero Rubín' },
];
