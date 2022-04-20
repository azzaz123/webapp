import { Injectable } from '@angular/core';
import { HistoricTransaction } from '@api/core/model';
import { SalesAsBuyerHttpService } from './http/sales-as-buyer-http.service';
import { Observable } from 'rxjs';

@Injectable()
export class SalesAsBuyerApiService {
  constructor(private salesAsBuyerHttpService: SalesAsBuyerHttpService) {}

  // public get(page: number = 0): Observable<HistoricTransaction[] | []> {
  //   return this.salesAsBuyerHttpService.get();
  // }
}
