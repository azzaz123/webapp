import { HELP_ARTICLE, HELP_LOCALE } from './help-constants';

const HELP_BASE_URL = 'https://ayuda.wallapop.com/hc/';
type HELP_ARTICLE_ID = HELP_ARTICLE;

export function getHelpUrl(article: HELP_ARTICLE_ID, locale: HELP_LOCALE): string {
  return `${HELP_BASE_URL}${HELP_LOCALE[locale]}/articles/${article}`;
}
