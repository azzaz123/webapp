import { Injectable } from '@angular/core';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UuidService {

  static getUUID(): string {
    return new UuidService().getUUID();
  }

  getUUID(): string {
    return v4();
  }
}
