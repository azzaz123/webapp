import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellapsedTime',
})
export class EllapsedTimePipe implements PipeTransform {
  constructor() {}

  transform(date: number) {}
}
