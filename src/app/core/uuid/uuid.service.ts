import { Injectable } from '@angular/core';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UuidService {

  getUUID(): string {
    return v4();
  }
}
