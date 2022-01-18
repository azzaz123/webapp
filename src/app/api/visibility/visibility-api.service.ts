import { Injectable } from '@angular/core';
import { BumpsPackageBalance } from '@api/core/model/bumps/bumps-package-balance.interface';
import { BumpsPackageUse } from '@api/core/model/bumps/bumps-package-use';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BumpsHttpService } from './http/bumps.service';
import { mapBalance } from './mappers/bumps-mapper';

@Injectable()
export class VisibilityApiService {
  constructor(private bumpsHttpService: BumpsHttpService) {}

  public getBalance(userId: string): Observable<BumpsPackageBalance[]> {
    return this.bumpsHttpService.getBalance(userId).pipe(map(mapBalance));
  }

  public bumpWithPackage(cart: BumpsPackageUse[]): Observable<void> {
    return this.bumpsHttpService.useBumpPackage(cart);
  }
}
