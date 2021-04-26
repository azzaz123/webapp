import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DeliveryDevelopmentGuard implements CanLoad {
  constructor() {}

  canLoad(): boolean {
    return true;
  }
}
