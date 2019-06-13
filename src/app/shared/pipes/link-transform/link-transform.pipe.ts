import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkTransform'
})
export class LinkTransformPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value + ' text';
  }
}
