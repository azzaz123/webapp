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
  mdIconRegistry.addSvgIconInNamespace('star', 'half', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/half_star.svg'));
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
  mdIconRegistry.addSvgIcon('logo', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/logo.svg'));
  mdIconRegistry.addSvgIcon('glass', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/glass.svg'));
  mdIconRegistry.addSvgIcon('categories', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories.svg'));
  mdIconRegistry.addSvgIcon('geo', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/geo.svg'));
  mdIconRegistry.addSvgIcon('home', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/home.svg'));
  mdIconRegistry.addSvgIcon('messages', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/messages.svg'));
  mdIconRegistry.addSvgIcon('arrow-waterfall', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow-waterfall.svg'));
  mdIconRegistry.addSvgIcon('category_All', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_All.svg'));
  mdIconRegistry.addSvgIcon('category_Appliances', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Appliances.svg'));
  mdIconRegistry.addSvgIcon('category_Babies', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Babies.svg'));
  mdIconRegistry.addSvgIcon('category_Cars', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Cars.svg'));
  mdIconRegistry.addSvgIcon('category_Electronics', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Electronics.svg'));
  mdIconRegistry.addSvgIcon('category_GamesBooks', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_GamesBooks.svg'));
  mdIconRegistry.addSvgIcon('category_God', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_God.svg'));
  mdIconRegistry.addSvgIcon('category_HomeGarden', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_HomeGarden.svg'));
  mdIconRegistry.addSvgIcon('category_Housing', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Housing.svg'));
  mdIconRegistry.addSvgIcon('category_Moda', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Moda.svg'));
  mdIconRegistry.addSvgIcon('category_Motor', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Motor.svg'));
  mdIconRegistry.addSvgIcon('category_Others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Others.svg'));
  mdIconRegistry.addSvgIcon('category_Services', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Services.svg'));
  mdIconRegistry.addSvgIcon('category_Sports', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Sports.svg'));
  mdIconRegistry.addSvgIcon('category_Videogames', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Videogames.svg'));
  mdIconRegistry.addSvgIcon('cat_laundry', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Appliances.svg'));
  mdIconRegistry.addSvgIcon('cat_baby_car', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Babies.svg'));
  mdIconRegistry.addSvgIcon('cat_smartphone', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Electronics.svg'));
  mdIconRegistry.addSvgIcon('cat_bookshelf', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_GamesBooks.svg'));
  mdIconRegistry.addSvgIcon('cat_furniture', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_HomeGarden.svg'));
  mdIconRegistry.addSvgIcon('cat_house', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Housing.svg'));
  mdIconRegistry.addSvgIcon('cat_t-shirt', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Moda.svg'));
  mdIconRegistry.addSvgIcon('cat_helmet', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Motor.svg'));
  mdIconRegistry.addSvgIcon('cat_ghost', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Others.svg'));
  mdIconRegistry.addSvgIcon('cat_toolbox', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Services.svg'));
  mdIconRegistry.addSvgIcon('cat_ball', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Sports.svg'));
  mdIconRegistry.addSvgIcon('cat_gamepad', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Videogames.svg'));
  mdIconRegistry.addSvgIcon('send', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/send.svg'));
  mdIconRegistry.addSvgIcon('wall', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wall.svg'));
  mdIconRegistry.addSvgIcon('check', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/check.svg'));
  mdIconRegistry.addSvgIcon('navigation_catalog', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_catalog.svg'));
  mdIconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/delete.svg'));
  mdIconRegistry.addSvgIcon('clock', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clock.svg'));
  mdIconRegistry.addSvgIcon('back-arrow', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/back-arrow.svg'));
  mdIconRegistry.addSvgIcon('commons-congrats', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/commons-congrats.svg'));
  mdIconRegistry.addSvgIcon('congrats', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/congrats.svg'));
  mdIconRegistry.addSvgIcon('items-empty-state', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/items-empty-state.svg'));
  mdIconRegistry.addSvgIcon('feature', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/feature.svg'));
  mdIconRegistry.addSvgIcon('shipping-available', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-available.svg'));
  mdIconRegistry.addSvgIcon('firm-price', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/firm-price.svg'));
  mdIconRegistry.addSvgIcon('accept-trades', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/accept-trades.svg'));
  mdIconRegistry.addSvgIcon('others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/others.svg'));
  mdIconRegistry.addSvgIcon('move-shape', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/move-shape.svg'));
  mdIconRegistry.addSvgIcon('electric', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/electric.svg'));
  mdIconRegistry.addSvgIcon('manual', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/manual.svg'));
  mdIconRegistry.addSvgIcon('automatic', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/automatic.svg'));
  mdIconRegistry.addSvgIcon('gasoil', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/gasoil.svg'));
  mdIconRegistry.addSvgIcon('gasoline', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/gasoline.svg'));
  mdIconRegistry.addSvgIcon('shipping-5', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-5.svg'));
  mdIconRegistry.addSvgIcon('shipping-10', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-10.svg'));
  mdIconRegistry.addSvgIcon('shipping-20', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-20.svg'));
  mdIconRegistry.addSvgIcon('shipping-30', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-30.svg'));
  mdIconRegistry.addSvgIcon('upload-dnd', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/upload-dnd.svg'));
  mdIconRegistry.addSvgIcon('ios', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/ios.svg'));
  mdIconRegistry.addSvgIcon('android', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/android.svg'));
  mdIconRegistry.addSvgIcon('herocat-cars', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-cars.svg'));
  mdIconRegistry.addSvgIcon('herocat-consumer-goods', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-consumer-goods.svg'));
  mdIconRegistry.addSvgIcon('herocat-real-estate', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-real-estate.svg'));
  mdIconRegistry.addSvgIcon('herocat-services', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-services.svg'));
  mdIconRegistry.addSvgIcon('camera', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/camera.svg'));
  mdIconRegistry.addSvgIcon('smove-shape', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/smove-shape.svg'));
  mdIconRegistry.addSvgIcon('speaker', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/speaker.svg'));
  mdIconRegistry.addSvgIcon('help', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/help.svg'));
  mdIconRegistry.addSvgIcon('twitter', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/twitter.svg'));
  mdIconRegistry.addSvgIcon('facebook', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/facebook.svg'));
}
