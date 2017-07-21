import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export function configIcons(mdIconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
  mdIconRegistry.addSvgIcon('heart', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/heart.svg'));
  mdIconRegistry.addSvgIcon('location', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/location.svg'));
  mdIconRegistry.addSvgIcon('others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/others.svg'));
  mdIconRegistry.addSvgIcon('phone', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/phone.svg'));
  mdIconRegistry.addSvgIcon('messages-icon', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/messages-icon.svg'));
  mdIconRegistry.addSvgIcon('call-missed', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/call-missed.svg'));
  mdIconRegistry.addSvgIcon('call-received', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/call-received.svg'));
  mdIconRegistry.addSvgIcon('call-shared', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/call-shared.svg'));
  mdIconRegistry.addSvgIconInNamespace('phone', 'empty', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/phone_empty.svg'));
  mdIconRegistry.addSvgIcon('reports', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/reports.svg'));
  mdIconRegistry.addSvgIconInNamespace('star', 'empty', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/star_empty.svg'));
  mdIconRegistry.addSvgIconInNamespace('star', 'full', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/star.svg'));
  mdIconRegistry.addSvgIcon('user', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/user.svg'));
  mdIconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/menu.svg'));
  mdIconRegistry.addSvgIcon('report-listing-0', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/other.svg'));
  mdIconRegistry.addSvgIcon('report-listing-1', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/miscategorized.svg'));
  mdIconRegistry.addSvgIcon('report-listing-2', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/animals.svg'));
  mdIconRegistry.addSvgIcon('report-listing-3', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/joke.svg'));
  mdIconRegistry.addSvgIcon('report-listing-4', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/fake.svg'));
  mdIconRegistry.addSvgIcon('report-listing-5', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/explicit.svg'));
  mdIconRegistry.addSvgIcon('report-listing-6', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/picture.svg'));
  mdIconRegistry.addSvgIcon('report-listing-7', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/food.svg'));
  mdIconRegistry.addSvgIcon('report-listing-8', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/drugs.svg'));
  mdIconRegistry.addSvgIcon('report-listing-9', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/duplicated.svg'));
  mdIconRegistry.addSvgIcon('report-listing-10', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/forbidden.svg'));
  mdIconRegistry.addSvgIcon('report-listing-11', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/resale.svg'));
  mdIconRegistry.addSvgIcon('report-listing-12', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/ad.svg'));
  mdIconRegistry.addSvgIcon('report-user-4', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/suspicious.svg'));
  mdIconRegistry.addSvgIcon('report-user-3', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/scam.svg'));
  mdIconRegistry.addSvgIcon('report-user-6', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/no-show.svg'));
  mdIconRegistry.addSvgIcon('report-user-5', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/behaviour.svg'));
  mdIconRegistry.addSvgIcon('report-user-7', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/defective.svg'));
  mdIconRegistry.addSvgIcon('report-user-0', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/ghost.svg'));
  mdIconRegistry.addSvgIcon('cross', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cross.svg'));
  mdIconRegistry.addSvgIcon('views', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/views.svg'));
  mdIconRegistry.addSvgIcon('calendar', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/calendar.svg'));
  mdIconRegistry.addSvgIcon('empty-state', sanitizer.bypassSecurityTrustResourceUrl('/assets/images/empty-state.svg'));
  mdIconRegistry.addSvgIcon('conversations-mock', sanitizer.bypassSecurityTrustResourceUrl('/assets/images/conversations-mock.svg'));
  mdIconRegistry.addSvgIcon('spinner', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/spinner.svg'));
  mdIconRegistry.addSvgIcon('sold', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sold.svg'));
  mdIconRegistry.addSvgIcon('reserved', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/reserved.svg'));
  mdIconRegistry.addSvgIcon('caret', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/caret.svg'));
  mdIconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
  mdIconRegistry.addSvgIcon('empty-phones', sanitizer.bypassSecurityTrustResourceUrl('/assets/images/empty-state-phones.svg'));
  mdIconRegistry.addSvgIcon('process-all', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/process-all.svg'));
  mdIconRegistry.addSvgIcon('upload', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/upload.svg'));
  mdIconRegistry.addSvgIcon('success', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/success.svg'));
  mdIconRegistry.addSvgIcon('error', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/error.svg'));
  mdIconRegistry.addSvgIcon('blocked', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/blocked.svg'));
  mdIconRegistry.addSvgIcon('time', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/time.svg'));
}
