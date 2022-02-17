import { environment } from '@environments/environment';

const SELECT_CARRIER_OFFICE_BASE_ENDPOINT = `${environment.baseUrl}api/v3/delivery/me/carrier-office-addresses`;
export const CREATE_SELECTED_CARRIER_OFFICE_ENDPOINT: string = SELECT_CARRIER_OFFICE_BASE_ENDPOINT;
export const UPDATE_SELECTED_CARRIER_OFFICE_ENDPOINT = (carrierId: string): string => `${SELECT_CARRIER_OFFICE_BASE_ENDPOINT}/${carrierId}`;
