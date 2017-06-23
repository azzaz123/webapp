import * as moment from 'moment';
import 'moment/locale/es.js';

export function configMoment(locale: string) {
  moment.locale(locale);
}
