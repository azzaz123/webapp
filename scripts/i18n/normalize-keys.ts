const fs = require('fs');
const xmlParser = require('xml2json');
const { execSync } = require('child_process');
const readline = require('readline');

const keyPrefix = 'web_';

enum LANGUAGE {
  SPANISH = 'es',
  ENGLISH = 'en'
}

interface CopyLocation {
  language: LANGUAGE;
  file: string;
}

type Translation = Record<LANGUAGE, string | Object>;

interface Copy {
  key: string;
  source: string;
  translation: Translation;
}

interface CopyNode {
  id: string;
  source?: string;
  text: string | Object; // BEFOREMERGE: Type object
}

type TranslatedNodes = Record<Partial<LANGUAGE>, CopyNode[]>;

interface MissingTranslation {
  id: string;
  missingLanguages: LANGUAGE[];
}

interface SubstitutionKey {
  oldKey: string;
  newKey: string;
  source: string;
}

class I18nNormalizer {
  private menuString = '\n\n' +
    'What should I do?\n' +
    '1. Run i18n\n' +
    '2. Print missing translations\n' +
    '3. Clean up keys\n' +
    'e. Exit\n' +
    'Ans: ';

  private copyLocations: CopyLocation[] = [{
    language: LANGUAGE.ENGLISH,
    file: 'src/locale/messages.xmb'
  }, {
    language: LANGUAGE.SPANISH,
    file: 'src/locale/es.xtb'
  }];

  private pathsToSkip = [
    'node_modules'
  ];
  private escapeLesserThan = '$LESSER_THAN';
  private escapeGreaterThan = '$GREATER_THAN';

  private originalLanguage = LANGUAGE.ENGLISH;

  private cumulativeIndex = 0;

  public async menu(): Promise<void> {
    const readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const answer = await new Promise(resolve => readlineInterface.question(this.menuString, (ans) => {
      readlineInterface.close();
      resolve(ans);
    }));

    switch (answer) {
      case '1':
        this.runI18n();
        break;
      case '2':
        this.printMissingTranslations();
        break;
      case '3':
        await this.addMissingKeys();
        await this.normalizeKeys();
        break;
      default:
        return;
    }

    return this.menu();
  }

  private getCopies(): Copy[] {
    const translatedNodes = this.getTranslatedNodes();
    const originalNodes = translatedNodes[this.originalLanguage];

    return originalNodes.map(node => {
      const languages = Object.values(LANGUAGE) as LANGUAGE[];

      return  {
        key: node.id,
        source: node.source,
        translation: languages.reduce((acc, lang) => {
          return {
            ...acc,
            [lang]: translatedNodes[lang].find(translatedNode => translatedNode.id === node.id)?.text
          };
        }, {} as Translation)
      };
    });
  }

  private runI18n() {
    execSync('yarn i18n');
  }

  private async addMissingKeys(): Promise<void> {
    const copies = this.getCopies();
    const copiesWithoutKey = copies.filter(copy => this.isNumericKey(copy.key));
    if (copiesWithoutKey.length > 0) {
      const substitutionKeys = copiesWithoutKey.map((copy) => ({
        oldKey: copy.key,
        source: copy.source,
        newKey: this.getNewKey(copy)
      }));

      console.log(
        '\nKeys to be added:\n',
        substitutionKeys.map(({ source, oldKey, newKey }) => `${source}: ${oldKey} -> ${newKey}`).join('\n')
      );

      if (await this.askForConfirmation()) {
        this.substituteKeys(substitutionKeys);

        console.log('\nChecking for more keys...\n');
        await this.addMissingKeys();
      }

    } else {
      console.log('\nNo missing keys\n');
    }
  }

  private printMissingTranslations(): void {
    const copies = this.getCopies();
    const missingTranslations = copies.reduce((acc, copy) => {
      const languageKeys: LANGUAGE[] = Object.keys(copy.translation) as LANGUAGE[];

      const missingLanguages = languageKeys.filter(lang => copy.translation[lang] === undefined);

      if (missingLanguages.length > 0) {
        acc.push({
          id: copy.key,
          missingLanguages
        });
      }

      return acc;
    }, [] as MissingTranslation[]);

    console.log(
      '\nMissing translations:\n',
      missingTranslations.map(missingTranslation => `${missingTranslation.id}: ${missingTranslation.missingLanguages.join(', ')}`)
        .join('\n')
    );
  }

  private async normalizeKeys(): Promise<void> {
    const copies = this.getCopies();
    const processedCopies: Copy[] = copies.map(copy => ({
      ...copy,
      key: this.generateNormalizedKey(copy.key)
    }));

    const substitutionKeys: SubstitutionKey[] = processedCopies.map((copy, index) => ({
      newKey: copy.key,
      oldKey: copies[index].key,
      source: copy.source
    })).filter(copy => copy.newKey !== copy.oldKey);

    if (substitutionKeys.length > 0) {
      console.log(
        `\nKeys to normalize:\n`,
        substitutionKeys.map(({ source, oldKey, newKey }) => `${source}: ${oldKey} -> ${newKey}`).join('\n')
      );

      if (await this.askForConfirmation()) {
        this.substituteKeys(substitutionKeys);
        console.log('\nChecking for more keys...\n');
        await this.normalizeKeys();
      }

    } else {
      console.log('No keys to normalize');
    }
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

  private substituteKeys(substitutionKeys: SubstitutionKey[]): void {
    substitutionKeys.forEach((substitutionKey) => {
      this.setNewKeyInSourceFiles(substitutionKey);
    });

    this.setNewKeysInFiles(substitutionKeys);

    this.runI18n();
  }

  private setNewKeyInSourceFiles(substitutionKey: SubstitutionKey): void {
    const {source, oldKey, newKey} = substitutionKey;
    const splitPath = source.split(':');
    const filePath = splitPath[0];

    let rawFile = fs.readFileSync(filePath, 'UTF-8');

    rawFile = rawFile.replace(new RegExp(`@@${oldKey}`, 'g'), `@@${newKey}`);

    fs.writeFileSync(filePath, rawFile);
  }

  private setNewKeysInFiles(substitutionKeys: SubstitutionKey[]): void {
    this.copyLocations.forEach(({ file }) => {
      let rawFile = fs.readFileSync(file, 'utf8');

      substitutionKeys.forEach(({oldKey, newKey}) => {
        const regexpFindOldKey = new RegExp(`"${oldKey}"`, 'g');

        rawFile = rawFile.replace(regexpFindOldKey, `"${newKey}"`);
      });

      fs.writeFileSync(file, rawFile);
    });
  }

  private getTranslatedNodes(): TranslatedNodes {
    return this.copyLocations.reduce((acc, location) => {
      return {
        ...acc,
        [location.language]: this.getNodeMessages(location.file)
      };
    }, {} as TranslatedNodes);
  }

  private getNodeMessages(copiesFileLocation): CopyNode[] {
    const copyNodes = this.getTranslationNodesFromFile(copiesFileLocation);
    return copyNodes.filter(node => !this.shouldSkipPath(node));
  }

  private getTranslationNodesFromFile(copiesFileLocation): CopyNode[] {
    const rawCopiesFile = fs.readFileSync(copiesFileLocation, 'utf8');

    const isXMB = copiesFileLocation.endsWith('.xmb');
    const isXTB = copiesFileLocation.endsWith('.xtb');

    if (isXMB) {
      const cleanedFileString = this.cleanupRawXMB(rawCopiesFile);
      const rawCopiesJSON = xmlParser.toJson(cleanedFileString);
      const copiesObject = JSON.parse(rawCopiesJSON);
      return copiesObject.messagebundle.msg;
    }

    if (isXTB) {
      const cleanedFileString = this.cleanupRawXTB(rawCopiesFile);
      const rawCopiesJSON = xmlParser.toJson(cleanedFileString, { alternateTextNode: 'text' } );
      const copiesObject = JSON.parse(rawCopiesJSON);
      return copiesObject.translationbundle.translation;
    }

    return [];
  }

  private shouldSkipPath(node: CopyNode): boolean {
    if (node.source) {
      for (const path of this.pathsToSkip) {
        if (node.source.startsWith(path)) {
          return true;
        }
      }
    }

    return false;
  }

  private cleanupRawXMB(rawStringFile): string {
    const translationTagSeparator = `msg`;
    const regexpMatchTranslationSeparatorsAperture = new RegExp(`</source>`, 'g');
    const regexpMatchTranslationSeparatorsClosure = new RegExp(`</${translationTagSeparator}>`, 'g');
    const apertureReplacement = '</source><text>';
    const closureReplacement = `</text></${translationTagSeparator}>`;
    const regexpCleanupInterpolations = new RegExp('/<ph.*\/>/', 'g');
    const interpolationsReplacement = '__INTERPOLATION__';

    return rawStringFile
      .replace(regexpMatchTranslationSeparatorsAperture, apertureReplacement)
      .replace(regexpMatchTranslationSeparatorsClosure, closureReplacement)
      .replace(regexpCleanupInterpolations, interpolationsReplacement);
  }

  private cleanupRawXTB(rawStringFile): string {
    const allLines = rawStringFile.split('\n');
    allLines.forEach((line, i) => {
      line = line.replace(/<ph/g, `${this.escapeLesserThan}ph`);
      line = line.replace(/<ex>/g, `${this.escapeLesserThan}ex${this.escapeGreaterThan}`);
      line = line.replace(/<\/ex>/g, `${this.escapeLesserThan}/ex${this.escapeGreaterThan}`);
      line = line.replace(/<\/ph>/g, `${this.escapeLesserThan}/ph${this.escapeGreaterThan}`);
      allLines[i] = line;
    });

    return allLines.join('\n');
  }

  private isNumericKey(id): boolean {
    return !isNaN(id) && !isNaN(parseFloat(id));
  }

  private generateKeyByPath(path: string): string {
    const pathWithoutFileLines = path.split(':')[0];
    const pathWithoutExtension = pathWithoutFileLines.replace('.component.html', '');
    const normalizedPath = pathWithoutExtension.replace(/-/g, '/');
    const splitBySlash = normalizedPath.split('/');
    const key = splitBySlash.slice(4, splitBySlash.length + 1).join('_');
    const normalizedKey = this.generateNormalizedKey(key);

    this.cumulativeIndex++;
    return `${normalizedKey}_${this.cumulativeIndex}`;
  }

  private getNewKey(node: Copy): string {
    const isAutogenerated = this.isNumericKey(node.key);
    if (isAutogenerated) {
      return this.generateKeyByPath(node.source);
    } else {
      return this.generateNormalizedKey(node.key);
    }
  }

  private snakeCase(string: string): string {
    return string.replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  }

  private generateNormalizedKey(key: string): string {
    let newKey = this.snakeCase(key);
    const needsPrefix = !newKey.startsWith(keyPrefix);
    if (needsPrefix) {
      newKey = `${keyPrefix}${newKey}`;
    }

    return newKey;
  }
}

new I18nNormalizer().menu().then(() => {
  console.log('Bye!');
});
