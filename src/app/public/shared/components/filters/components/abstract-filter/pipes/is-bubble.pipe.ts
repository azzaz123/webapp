import { Pipe, PipeTransform } from '@angular/core';
import { FILTER_VARIANT } from '../abstract-filter.enum';

@Pipe({
  name: 'isBubble',
})
export class IsBubblePipe implements PipeTransform {
  transform(variant: FILTER_VARIANT): boolean {
    return variant === FILTER_VARIANT.BUBBLE;
  }
}
