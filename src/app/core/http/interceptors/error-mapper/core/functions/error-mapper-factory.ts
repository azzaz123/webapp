import { HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from '@environments/environment.beta';
import { DeliveryAddressErrorMapper } from '../classes/mappers/delivery-address/delivery-address-error-maper';
import { ErrorMapper } from '../classes/mappers/error-mapper';
import { ERROR_MAPPABLE_ENDPOINTS } from '../constants/error-mappable-endpoints';

export function ErrorMapperFactory(request: HttpRequest<unknown>, handler: HttpHandler) {
  const errorMapperType = getErrorMapperByEndpoint(request);

  if (errorMapperType === DeliveryAddressErrorMapper) {
    return new DeliveryAddressErrorMapper(request, handler);
  }

  return null;
}

const getErrorMapperByEndpoint = (request: HttpRequest<unknown>): typeof ErrorMapper => {
  const { url } = request;

  const isDeliveryAddressRequest = url.startsWith(getMapableEndpointWithBase(ERROR_MAPPABLE_ENDPOINTS.DELIVERY_ADDRESS));
  if (isDeliveryAddressRequest) {
    return DeliveryAddressErrorMapper;
  }
};

const getMapableEndpointWithBase = (endpoint: ERROR_MAPPABLE_ENDPOINTS): string => {
  return `${environment.baseUrl}${endpoint}`;
};
