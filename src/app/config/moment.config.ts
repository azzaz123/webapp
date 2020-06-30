import * as moment from 'moment';
import 'moment/locale/es';

export function configMoment(locale: string) {
  moment.locale(locale);
}
