import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'linkTransform'
})
export class LinkTransformPipe implements PipeTransform {

  // tslint:disable-next-line:max-line-length
  private static readonly LINK_REG_EXP = /(https?:\/\/(?:www\.|(?!www))[\w\d][\w\d-]+[\w\d]\.[^\s]{2,}|www\.[\w\d][\w\d-]+[\w\d]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[\w\d]+\.[^\s]{2,}|www\.[\w\d]+\.[^\s]{2,})/g;

  private static getFormattedLink(link: string): string {
    return `<a href="${link}" target="_blank">${link}</a>`;
  }

  transform(message: string, args?: any): string {
    new Set(message.match(LinkTransformPipe.LINK_REG_EXP))
      .forEach(link => message = message.replace(new RegExp(link, 'g'), LinkTransformPipe.getFormattedLink(link)));

    return message;
  }
}
