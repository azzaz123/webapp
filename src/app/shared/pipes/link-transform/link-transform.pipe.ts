import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'linkTransform'
})
export class LinkTransformPipe implements PipeTransform {

  private static readonly LINK_REG_EXP = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);

  private static getFormattedLink(link: string): string {
    return `<a href="${link}" target="_blank">${link}</a>`;
  }

  transform(value: string, args?: any): any {
    new Set(LinkTransformPipe.LINK_REG_EXP.exec(value))
      .forEach(link => value = value.replace(link, LinkTransformPipe.getFormattedLink(link)));

    return value;
  }
}
