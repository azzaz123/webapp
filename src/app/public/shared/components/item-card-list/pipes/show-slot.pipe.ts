import { Pipe, PipeTransform } from '@angular/core';
import { SlotsConfig } from '../interfaces/slots-config.interface';

@Pipe({
  name: 'showSlot',
})
export class ShowSlotPipe implements PipeTransform {
  constructor() {}

  transform(index: number, slotsConfig: SlotsConfig): boolean {
    return index >= slotsConfig.start && (index - slotsConfig.start) % slotsConfig.offset === 0;
  }
}
