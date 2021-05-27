const https = require('https');
const fs = require('fs');

interface TranslationSet {
  locale: string;
  translations: Translation[];
}

type PhraseLocaleTranslations = Record<string, { message: string }>;

type ReplacerFunc = ((substring: string, ...args: any[]) => string);

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

interface TranslatedPhraseLocale extends PhraseLocale {
  originals: Translation[];
}

interface Translation {
  key: string;
  value: string;
}

interface RegexFormatter {
  regex: RegExp;
  replacer: (index: number) => ReplacerFunc;
}

interface PhraseData {
  translationSets: TranslationSet[];
  interpolationOriginals: Record<string, string>;
}

class PhraseRetriever {
  private projectId = '6f8665baabfafbb8482640f06712bf9a'; // TODO: Playground id. Use WallapopApp id
  private bearerToken = '5b84d7edef0d28a953e445a7372f5ed859543733b0f7de83a459f19d381ac4ef'; // TODO: Test token. Use production token
  // private phraseTags = ['legacy_web', 'multiplatform'];
  private phraseTags = ['test'];

  private phraseHtmlRegexFormatters: RegexFormatter[] = [{
    regex: /<b>(.+?)<\/b>/,
    replacer: (index) => this.simpleTagReplacer('BOLD_TEXT', index)
  }, {
    regex: /<i>(.+?)<\/i>/,
    replacer: (index) => this.simpleTagReplacer('ITALIC_TEXT', index)
  }, {
    regex: /<u>(.+?)<\/u>/,
    replacer: (index) => this.simpleTagReplacer('UNDERLINED_TEXT', index)
  }, {
    regex: /<s>(.+?)<\/s>/,
    replacer: (index) => this.simpleTagReplacer('STRIKETHROUGH_TEXT', index)
  }, {
    regex: /<span>(.+?)<\/span>/,
    replacer: (index) => this.simpleTagReplacer('TAG_SPAN', index)
  }, {
    regex: /<a(?: .*?>|>)(.+?)<\/a>/,
    replacer: (index) => this.simpleTagReplacer('LINK', index)
  }, {
    regex: /%(\d+?)\$s/,
    replacer: () => this.interpolationReplacer()
  }];

  public async mergeTranslationsWithLocal(): Promise<void> {
    console.log('Retrieving translations from phrase');
    const locales = await this.getPhraseTranslations();
    const translationSets = this.getTranslationSets(locales);

    // TODO: Merge will be added on another PR

    // this.mergeCopySets(translationSets);
  }

  private async getPhraseTranslations(): Promise<TranslatedPhraseLocale[]> {
    const locales = await this.getLocales();

    return Promise.all(locales.map(async locale => {
      const phraseTranslations = await this.getLocaleTranslations(locale);
      const originals: Translation[] = [];
      const keys = Object.keys(phraseTranslations);

      keys.forEach(key => {
        originals.push({
          key,
          value: phraseTranslations[key].message
        });
      });

      return {
        ...locale,
        originals
      };
    }));
  }

  private getTranslationSets(locales: TranslatedPhraseLocale[]): TranslationSet[] {
    const translationSets: TranslationSet[] = [];

    for (const locale of locales) {
      const phraseTranslations = locale.originals;

      translationSets.push({
        locale: locale.name,
        translations: phraseTranslations.map(translation => ({
          key: translation.key,
          value: this.formatPhraseHtmlNodes(translation.value)
        }))
      });
    }

    return translationSets;
  }

  private formatPhraseHtmlNodes(message: string): string {
    let formattedMessage = message;

    this.phraseHtmlRegexFormatters.forEach(({ regex, replacer }) => {
      const globalRegex = new RegExp(regex, 'gm');

      const matches = message.match(globalRegex);

      if (matches) {
        (matches).forEach((substr, index) => {
          formattedMessage = formattedMessage.replace(regex, replacer(index) as any);
        });
      }
    });

    return formattedMessage;
  }

  private getLocaleTranslations(locale: PhraseLocale): Promise<PhraseLocaleTranslations> {
    return this.get<PhraseLocaleTranslations>(`https://api.phrase.com/v2/projects/${this.projectId}/locales/${locale.id}/download?file_format=json&tags=${this.phraseTags.join(',')}`);
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

  private interpolationReplacer(): ReplacerFunc {
    return (substring: string, interpolatorIndex: string) => {
      const interpolationValue = Number.parseInt(interpolatorIndex, 0) - 1;

      return interpolationValue ? `{$INTERPOLATION_${interpolationValue}}` : '{$INTERPOLATION}';
    };
  }

  private simpleTagReplacer(placeholder: string, index: number): ReplacerFunc {
    return (substring: string, content: string) => {
      const startTag = index ? `{$START_${placeholder}_${index}}` : `{$START_${placeholder}}`;
      const endTag = `{$END_${placeholder}}`;

      return `${startTag}${content}${endTag}`;
    };
  }
}

new PhraseRetriever().mergeTranslationsWithLocal().then(() => {
  console.log('Translations updated from phrase');
});
