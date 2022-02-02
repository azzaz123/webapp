import { environment } from '@environments/environment';

const DELIVERY_BUYER_CALCULATOR_BASE_URL: string = `${environment.baseUrl}api/v3/delivery/buyer/calculator`;
export const DELIVERY_BUYER_CALCULATOR_COSTS_ENDPOINT: string = `${DELIVERY_BUYER_CALCULATOR_BASE_URL}/costs`;
