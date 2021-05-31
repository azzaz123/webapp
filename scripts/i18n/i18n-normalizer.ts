const fs = require('fs');
const xmlParser = require('xml2json');
const { execSync } = require('child_process');
const readline = require('readline');
const https = require('https');

enum LANGUAGE {
  SPANISH = 'es',
  ENGLISH = 'en'
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

type PhraseLocaleTranslations = Record<string, { message: string }>;

interface TranslatedPhraseLocale extends PhraseLocale {
  originals: Translation[];
}

interface Translation {
  key: string;
  value: string;
}

interface RegexFormatter {
  regex: RegExp;
  replacer: string | ((index: number) => ReplacerFunc);
}

interface TranslationSet {
  locale: string;
  translations: Translation[];
}

type ReplacerFunc = ((substring: string, ...args: any[]) => string);

interface CopyLocation {
  language: LANGUAGE;
  file: string;
}

interface CopySource {
  key: string;
  sources: string[];
}

interface MissingTranslation {
  id: string;
  missingLanguages: LANGUAGE[];
}

class I18nNormalizer {
  private menuString = '\n\n' +
    'What should I do?\n' +
    '1. Run i18n\n' +
    '2. Print missing translations\n' +
    '3. Clean translations files\n' +
    '4. Download and merge Phrase\n' +
    '5. Prepare Phrase files to upload\n' +
    'e. Exit\n' +
    'Ans: ';
  private confirmDoneString = '\n\nPress enter to clean when done uploading: ';

  private copyLocations: CopyLocation[] = [{
    language: LANGUAGE.ENGLISH,
    file: 'src/locale/messages.en.json'
  }, {
    language: LANGUAGE.SPANISH,
    file: 'src/locale/messages.es.json'
  }];

  private sourcedMessagesFile = 'src/locale/messages.xlf';

  private originalLanguage = LANGUAGE.ENGLISH;

  private projectId = '00bf7dee267ad3d87db0f7f4da989e43';
  private bearerToken = '67f5e5862f1ac8f3fed7bce2cc8653fd5d41911f80848f490e1464f3aa507100';
  private phraseTags = ['multiplatform'];
  // private phraseTags = ['multiplatform', 'legacy_web'];

  private phraseHtmlRegexFormatters: RegexFormatter[] = [{
    regex: /<b(?: .*?>|>)(.+?)<\/b>/,
    replacer: '$1'
  }, {
    regex: /<i(?: .*?>|>)(.+?)<\/i>/,
    replacer: '$1'
  }, {
    regex: /<u(?: .*?>|>)(.+?)<\/u>/,
    replacer: '$1'
  }, {
    regex: /<s(?: .*?>|>)(.+?)<\/s>/,
    replacer: '$1'
  }, {
    regex: /<span(?: .*?>|>)(.+?)<\/span>/,
    replacer: '$1'
  }, {
    regex: /<a(?: .*?>|>)(.+?)<\/a>/,
    replacer: '$1'
  }, {
    regex: /%(\d+?)\$s/,
    replacer: () => this.interpolationReplacer()
  }];

  public async menu(): Promise<void> {
    const answer = await this.askInput(this.menuString);

    switch (answer) {
      case '1':
        this.runI18n();
        break;
      case '2':
        this.printMissingTranslations();
        break;
      case '3':
        this.cleanTranslationFiles();
        break;
      case '4':
        await this.mergeTranslationsWithLocal();
        break;
      case '5':
        await this.preparePhraseFiles();
        break;
      default:
        return;
    }

    return this.menu();
  }

  private async preparePhraseFiles(): Promise<void> {
    const currentTranslationSets = this.getCurrentTranslationSets();

    const languages = Object.values(LANGUAGE);

    languages.forEach(lang => {
      const translationArray = currentTranslationSets.find(set => set.locale === lang).translations;
      const translations = translationArray.reduce((acc, tr) => {
        return {
          ...acc,
          [tr.key]: tr.value
        };
      }, {});

      fs.writeFileSync(`src/locale/phrase.${lang}.json`, JSON.stringify(translations, undefined, 2));
    });

    await this.askInput(this.confirmDoneString);

    execSync(`rm src/locale/phrase.*.json`);
  }

  private cleanTranslationFiles(): void {
    const translationSets = this.getCurrentTranslationSets();
    const originalCopies = translationSets.find(set => set.locale === this.originalLanguage).translations;

    this.copyLocations.filter((location) => location.language !== this.originalLanguage).forEach(location => {
      const copies = translationSets.find(set => set.locale === location.language).translations;
      const translations = {};

      const keys = originalCopies.map(copy => copy.key);
      keys.forEach(key => {
        translations[key] = copies.find(copy => copy.key === key).value;
      });

      fs.writeFileSync(location.file, JSON.stringify({ locale: location.language, translations}, undefined, 2));
    });
  }

  private generateSourcedCopies(): void {
    console.log('Generating sources...');
    execSync('ng extract-i18n --output-path=src/locale');
  }

  private clearSourcedCopies(): void {
    console.log('Cleaning generated source files...');
    execSync(`rm ${this.sourcedMessagesFile}`);
  }

  public async mergeTranslationsWithLocal(): Promise<void> {
    const locales = await this.getPhraseLocales();

    const originalTranslationSets = this.getOriginalTranslationSets(locales);
    const formattedTranslationSets = this.getFormattedTranslationSets(locales);

    // TODO: Merge will be added on another PR

    console.log(originalTranslationSets);
    console.log(formattedTranslationSets);

    // this.mergeCopySets(translationSets);
  }

  private getCopySources(): CopySource[] {
    this.generateSourcedCopies();
    const rawCopiesFile = fs.readFileSync(this.sourcedMessagesFile, 'utf8');

    const rawCopiesJSON = xmlParser.toJson(rawCopiesFile);
    const transUnits = JSON.parse(rawCopiesJSON).xliff.file.body['trans-unit'];

    this.clearSourcedCopies();

    return transUnits.map(transUnit => {
      const contextGroup = transUnit['context-group'];

      const contexts = contextGroup instanceof Array
        ? contextGroup.reduce((acc, group) => {
            acc.push(...group.context);
            return acc;
          }, [])
        : contextGroup.context;

      return {
        key: transUnit.id,
        sources: contexts.filter(context => context['context-type'] === 'sourcefile').map(context => context.$t)
      };
    });
  }

  private runI18n() {
    execSync('yarn i18n');
  }

  private printMissingTranslations(): void {
    const currentTranslationSets = this.getCurrentTranslationSets();
    const originalTranslations = currentTranslationSets.find(languageCopy => languageCopy.locale === this.originalLanguage).translations;
    const otherTranslationSets = currentTranslationSets.filter(languageCopy => languageCopy.locale !== this.originalLanguage);
    const missingTranslations: MissingTranslation[] = [];

    originalTranslations.forEach(originalTranslation => {
      const missingLanguages = [];

      otherTranslationSets.forEach(set => {
        const foundTr = set.translations.find(tr => tr.key === originalTranslation.key);

        if (!foundTr) {
          missingLanguages.push(set.locale);
        }
      });

      if (missingLanguages.length > 0) {
        missingTranslations.push({
          id: originalTranslation.key,
          missingLanguages
        });
      }
    });

    if (missingTranslations.length > 0) {
      console.log(
        '\nMissing translations:\n',
        missingTranslations.map(missingTranslation => `${missingTranslation.id}: ${missingTranslation.missingLanguages.join(', ')}`)
          .join('\n')
      );
    } else {
      console.log('\nNo missing translations\n');
    }
  }

  private getCurrentTranslationSets(): TranslationSet[] {
    return this.copyLocations.map(location => {
      return {
        locale: location.language,
        translations: this.getJsonCopies(location.file)
      };
    });
  }

  private getJsonCopies(copiesFileLocation: string): Translation[] {
    const rawCopiesFile = fs.readFileSync(copiesFileLocation, 'utf8');

    const copiesObject = JSON.parse(rawCopiesFile);
    const translations = copiesObject.translations;

    const keys = Object.keys(translations);

    return keys.map(key => ({
      key,
      value: translations[key]
    }));
  }

  private async askInput(message: string): Promise<string> {
    const readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => readlineInterface.question(message, (ans) => {
      readlineInterface.close();
      resolve(ans);
    }));
  }

  private async getPhraseLocales(): Promise<TranslatedPhraseLocale[]> {
    console.log('Retrieving translations from phrase...');
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

  private getOriginalTranslationSets(locales: TranslatedPhraseLocale[]): TranslationSet[] {
    console.log('Recovering original translations...');
    return locales.map(locale => ({
      locale: locale.name,
      translations: locale.originals
    }));
  }

  private getFormattedTranslationSets(locales: TranslatedPhraseLocale[]): TranslationSet[] {
    console.log('Recovering formatted translations...');
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
          if (typeof replacer === 'string') {
            formattedMessage = formattedMessage.replace(regex, replacer);
          } else {
            formattedMessage = formattedMessage.replace(regex, replacer(index));
          }
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
}

new I18nNormalizer().menu().then(() => {
  console.log('Bye!');
});
