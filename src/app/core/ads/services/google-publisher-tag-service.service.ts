import { Injectable } from '@angular/core';
import { AdSlotId } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GooglePublisherTagServiceService {
  constructor() {}

  public displayAdBySlotId(slotId: AdSlotId): void {
    googletag.cmd.push(() => {
      googletag.display(slotId);
    });
  }
}
