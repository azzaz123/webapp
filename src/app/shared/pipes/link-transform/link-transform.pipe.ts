import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'linkTransform'
})
export class LinkTransformPipe implements PipeTransform {

  private static readonly LINK_EXPRESION = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

  transform(value: string, args?: any): any {
    const linkRegEx = new RegExp(LinkTransformPipe.LINK_EXPRESION);

    new Set(linkRegEx.exec(value))
      .forEach(link => value = value.replace(link, this.getFormattedLink(link)));

    return value;
  }

  private getFormattedLink(link: string): string {
    return `<a href="${link}" target="_blank">${link}</a>`;
  }
}
