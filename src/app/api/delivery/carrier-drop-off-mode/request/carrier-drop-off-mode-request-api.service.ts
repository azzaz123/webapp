import { Injectable } from '@angular/core';
import { CarrierDropOffModeRequest } from '@api/core/model/delivery/carrier-drop-off-mode/carrier-drop-off-mode-request.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CarrierDropOffModeRequestDto } from './dtos/carrier-drop-off-mode-request-dto.interface';
import { CarrierDropOffModeRequestHttpService } from './http/carrier-drop-off-mode-request-http.service';
import { mapCarrierDropOffRequestModeDtoToCarrierDropOffModeRequest } from './mappers/carrier-drop-off-mode-request.mapper';

@Injectable({
  providedIn: 'root',
})
export class CarrierDropOffModeRequestApiService {
  constructor(private carrierDropOffModeRequestHttpService: CarrierDropOffModeRequestHttpService) {}

  public get(requestId: string): Observable<CarrierDropOffModeRequest> {
    return this.carrierDropOffModeRequestHttpService
      .get(requestId)
      .pipe(map((dtoResponse: CarrierDropOffModeRequestDto) => mapCarrierDropOffRequestModeDtoToCarrierDropOffModeRequest(dtoResponse)));
  }
}
