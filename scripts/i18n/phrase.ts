const https = require('https');
const fs = require('fs');

interface TranslationSet {
  locale: string;
  translations: Record<string, string>;
}

type PhraseLocaleTranslations = Record<string, { message: string }>;

interface CopyLocation {
  language: LANGUAGE;
  file: string;
}

interface PhraseLocale {
  id: string;
  name: string;
  code: string;
  default: true;
  main: false;
  rtl: false;
  plural_forms: string[];
  source_locale: {
    id: string,
    name: string,
    code: string
  };
  created_at: string;
  updated_at: string;
}

interface RegexFormatter {
  regex: RegExp;
  replacer: string;
}

class PhraseRetriever {
  private projectId = '6f8665baabfafbb8482640f06712bf9a'; // TODO: Playground id. Use WallapopApp id
  private bearerToken = '5b84d7edef0d28a953e445a7372f5ed859543733b0f7de83a459f19d381ac4ef'; // TODO: Test token. Use production token

  private phraseHtmlRegexFormatters: RegexFormatter[] = [{
    regex: / /,
    replacer: ''
  }];

  public async mergeTranslationsWithLocal(): Promise<void> {
    console.log('Retrieving translations from phrase');
    const translationSets = await this.getTranslationSets();

    console.log('PhraseRetriever.mergeTranslationsWithLocal - TranslationSets', translationSets);

    // TODO: Merge will be added on another PR

    // this.mergeCopySets(translationSets);
  }

  private async getTranslationSets(): Promise<TranslationSet[]> {
    const locales = await this.getLocales();

    const translationSets: TranslationSet[] = [];

    for (const locale of locales) {
      const phraseTranslations = await this.getLocaleTranslations(locale);
      const translations = {};
      const keys = Object.keys(phraseTranslations);

      for (const key of keys) {
        translations[key] = this.formatPhraseHtmlNodes(phraseTranslations[key].message);
      }

      translationSets.push({
        locale: locale.name,
        translations
      });
    }

    return translationSets;
  }

  private formatPhraseHtmlNodes(message: string): string {
    let formattedMessage = message;

    this.phraseHtmlRegexFormatters.forEach(({ regex, replacer }) => formattedMessage = formattedMessage.replace(regex, replacer));

    return formattedMessage;
  }

  private getLocaleTranslations(locale: PhraseLocale): Promise<PhraseLocaleTranslations> {
    return this.get<PhraseLocaleTranslations>(`https://api.phrase.com/v2/projects/${this.projectId}/locales/${locale.id}/download?file_format=json`);
  }

  private getLocales(): Promise<PhraseLocale[]> {
    return this.get<PhraseLocale[]>(`https://api.phrase.com/v2/projects/${this.projectId}/locales`);
  }

  private get<T>(endpoint: string): Promise<T> {
    return new Promise((resolve, reject) => {
      https.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`
        }
      }, (resp) => {
        let data = '';

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(JSON.parse(data));
        });

      }).on('error', (err) => {
        reject(err);
      });
    });
  }
}

new PhraseRetriever().mergeTranslationsWithLocal().then(() => {
  console.log('Translations updated from phrase');
});
