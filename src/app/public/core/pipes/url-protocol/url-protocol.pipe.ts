import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlProtocol',
})
export class UrlProtocolPipe implements PipeTransform {
  constructor() {}

  transform(url: string): string {
    const regExp = new RegExp(/^(https|http):\/\/(.*)$/);
    return regExp.test(url) ? url : `//${url}`;
  }
}
