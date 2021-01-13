export interface UserLocation {
  id: number;
  approximated_latitude: number;
  approximated_longitude: number;
  city: string;
  zip: string;
  approxRadius: number;
  title?: string;
  full_address?: string;
  approximated_location?: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
}
