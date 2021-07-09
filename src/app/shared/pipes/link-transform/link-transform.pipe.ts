import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkTransform',
})
export class LinkTransformPipe implements PipeTransform {
  // eslint-disable-next-line max-len
  public static readonly LINK_REG_EXP = /(https?:\/\/(?:www\.|(?!www))[\w\d][\w\d-]+[\w\d]\.[^\s]{2,}|www\.[\w\d][\w\d-]+[\w\d]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[\w\d]+\.[^\s]{2,}|www\.[\w\d]+\.[^\s]{2,})|((com\.)|(es\.)|(co\.uk\.)|(uk\.)|(fr\.)|(com\.br\.)|(pro\.)|(prod\.)|(test\.)|(es.beta\.)|(beta\.)|(alfa\.)|(us\.)|(corp\.))?wallapop\.com[^\s]{0,}|fleapster\.com[^\s]{0,}/g;
  // eslint-disable-next-line max-len
  public static readonly WALLAPOP_REG_EXP = /https?:\/\/(www\.)?((com\.)|(es\.)|(co\.uk\.)|(uk\.)|(fr\.)|(com\.br\.)|(pro\.)|(prod\.)|(test\.)|(beta\.)|(alfa\.)|(us\.)|(corp\.))?wallapop\.com[^\s]{0,}|(www\.)?((com\.)|(es\.)|(co\.uk\.)|(uk\.)|(fr\.)|(com\.br\.)|(pro\.)|(prod\.)|(test\.)|(es.beta\.)|(beta\.)|(alfa\.)|(us\.)|(corp\.))?wallapop\.com[^\s]{0,}|(https?:\/\/)?(www\.)?fleapster\.com[^\s]{0,}/g;
  public static readonly PROTOCOL_REG_EXP = /^(?:[a-z]+:)?\/\//i;

  private static hasProtocol(link: string): boolean {
    return LinkTransformPipe.PROTOCOL_REG_EXP.test(link);
  }

  private static getFormattedLink(link: string): string {
    return this.hasProtocol(link) ? `<a href="${link}" target="_blank">${link}</a>` : `<a href="//${link}" target="_blank">${link}</a>`;
  }

  transform(message: string, args?: any): string {
    new Set(message.match(LinkTransformPipe.LINK_REG_EXP)).forEach(
      (link) => (message = message.split(link).join(LinkTransformPipe.getFormattedLink(link)))
    );

    return message;
  }
}
