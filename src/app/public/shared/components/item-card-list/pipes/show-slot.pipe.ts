import { Pipe, PipeTransform } from '@angular/core';
import { SlotsConfig } from '../interfaces/slots-config.interface';

@Pipe({
  name: 'showSlot',
})
export class ShowSlotPipe implements PipeTransform {
  transform(index: number, slotsConfig: SlotsConfig): boolean {
    return index > 0 && (index - slotsConfig.start) % slotsConfig.offset === 0;
  }
}
