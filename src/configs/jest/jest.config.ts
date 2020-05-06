// This line loads the necessary presets for jest to work with Angular
import 'jest-preset-angular';

// TODO: An issue with `jest-preset-angular` is using only "compilerOptions" in tsconfig, using necessary imports here
// More info about the issue: https://github.com/thymikee/jest-preset-angular/issues/347
import '@angular/localize/init';

// Libraries needed in the tests
import * as XMPP from '../../../node_modules/stanza.io/build/stanzaio.bundle.min.js';
import * as Visibility from '../../../node_modules/visibilityjs/lib/visibility.core.js';
import * as appboy from '../../../node_modules/appboy-web-sdk/appboy.min.js';

// For some reason, the typings and the imports are not asigning themselves as they are in the Angular app.
// Manual assignment here
window['XMPP'] = XMPP;
window['Visibility'] = Visibility;
window['appboy'] = appboy;

// Mock libraries we can not import because script is loaded in index.html
import './global-mocks.fixtures.spec';

// Extra definitions for ads libraries
import '../../assets/js/adsConfig.js';
import '../../assets/js/quantcast.js';

