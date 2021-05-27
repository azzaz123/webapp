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
  replacer: (index: number) => ReplacerFunc;
}

interface TranslationSet {
  locale: string;
  translations: Translation[];
}

interface RegexFormatter {
  regex: RegExp;
  replacer: (index: number) => ReplacerFunc;
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

  private projectId = '6f8665baabfafbb8482640f06712bf9a'; // TODO: Playground id. Use WallapopApp id
  private bearerToken = '5b84d7edef0d28a953e445a7372f5ed859543733b0f7de83a459f19d381ac4ef'; // TODO: Test token. Use production token
  private phraseTags = ['legacy_web', 'multiplatform'];
  // private phraseTags = ['test'];

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

    const sources = this.getCopySources();
    const originalTranslationSets = this.getOriginalTranslationSets(locales);
    const formattedTranslationSets = this.getFormattedTranslationSets(locales);

    // TODO: Merge will be added on another PR

    console.log(sources);
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
    const missingTranslations = [];

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

  private async askForConfirmation(): Promise<boolean> {
    const readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise(resolve => readlineInterface.question('Do you want to proceed? (Y/n): ', (ans) => {
      readlineInterface.close();
      resolve(ans);
    }));

    return answer === 'y' || answer === 'Y';
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

new I18nNormalizer().menu().then(() => {
  console.log('Bye!');
});
