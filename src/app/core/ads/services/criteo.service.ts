import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CriteoService {
  public isLibraryRefDefined(): boolean {
    return !!Criteo;
  }
}
