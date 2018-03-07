import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export function configIcons(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
  matIconRegistry.addSvgIcon('heart', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/heart.svg'));
  matIconRegistry.addSvgIcon('location', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/location.svg'));
  matIconRegistry.addSvgIcon('others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/others.svg'));
  matIconRegistry.addSvgIcon('phone', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/phone.svg'));
  matIconRegistry.addSvgIcon('messages-icon', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/messages-icon.svg'));
  matIconRegistry.addSvgIcon('call-missed', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/call-missed.svg'));
  matIconRegistry.addSvgIcon('call-received', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/call-received.svg'));
  matIconRegistry.addSvgIcon('call-shared', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/call-shared.svg'));
  matIconRegistry.addSvgIconInNamespace('phone', 'empty', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/phone_empty.svg'));
  matIconRegistry.addSvgIcon('reports', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/reports.svg'));
  matIconRegistry.addSvgIconInNamespace('star', 'empty', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/star_empty.svg'));
  matIconRegistry.addSvgIconInNamespace('star', 'full', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/star.svg'));
  matIconRegistry.addSvgIconInNamespace('star', 'half', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/half_star.svg'));
  matIconRegistry.addSvgIcon('user', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/user.svg'));
  matIconRegistry.addSvgIcon('menu', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/menu.svg'));
  matIconRegistry.addSvgIcon('report-listing-0', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/other.svg'));
  matIconRegistry.addSvgIcon('report-listing-1', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/miscategorized.svg'));
  matIconRegistry.addSvgIcon('report-listing-2', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/animals.svg'));
  matIconRegistry.addSvgIcon('report-listing-3', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/joke.svg'));
  matIconRegistry.addSvgIcon('report-listing-4', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/fake.svg'));
  matIconRegistry.addSvgIcon('report-listing-5', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/explicit.svg'));
  matIconRegistry.addSvgIcon('report-listing-6', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/picture.svg'));
  matIconRegistry.addSvgIcon('report-listing-7', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/food.svg'));
  matIconRegistry.addSvgIcon('report-listing-8', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/drugs.svg'));
  matIconRegistry.addSvgIcon('report-listing-9', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/duplicated.svg'));
  matIconRegistry.addSvgIcon('report-listing-10', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/forbidden.svg'));
  matIconRegistry.addSvgIcon('report-listing-11', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/resale.svg'));
  matIconRegistry.addSvgIcon('report-listing-12', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/ad.svg'));
  matIconRegistry.addSvgIcon('report-user-4', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/suspicious.svg'));
  matIconRegistry.addSvgIcon('report-user-3', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/scam.svg'));
  matIconRegistry.addSvgIcon('report-user-6', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/no-show.svg'));
  matIconRegistry.addSvgIcon('report-user-5', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/behaviour.svg'));
  matIconRegistry.addSvgIcon('report-user-7', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/defective.svg'));
  matIconRegistry.addSvgIcon('report-user-0', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/ghost.svg'));
  matIconRegistry.addSvgIcon('cross', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cross.svg'));
  matIconRegistry.addSvgIcon('views', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/views.svg'));
  matIconRegistry.addSvgIcon('calendar', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/calendar.svg'));
  matIconRegistry.addSvgIcon('empty-state', sanitizer.bypassSecurityTrustResourceUrl('/assets/images/empty-state.svg'));
  matIconRegistry.addSvgIcon('conversations-mock', sanitizer.bypassSecurityTrustResourceUrl('/assets/images/conversations-mock.svg'));
  matIconRegistry.addSvgIcon('spinner', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/spinner.svg'));
  matIconRegistry.addSvgIcon('sold', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sold.svg'));
  matIconRegistry.addSvgIcon('reserved', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/reserved.svg'));
  matIconRegistry.addSvgIcon('caret', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/caret.svg'));
  matIconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
  matIconRegistry.addSvgIcon('empty-phones', sanitizer.bypassSecurityTrustResourceUrl('/assets/images/empty-state-phones.svg'));
  matIconRegistry.addSvgIcon('process-all', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/process-all.svg'));
  matIconRegistry.addSvgIcon('upload', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/upload.svg'));
  matIconRegistry.addSvgIcon('success', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/success.svg'));
  matIconRegistry.addSvgIcon('error', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/error.svg'));
  matIconRegistry.addSvgIcon('blocked', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/blocked.svg'));
  matIconRegistry.addSvgIcon('time', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/time.svg'));
  matIconRegistry.addSvgIcon('logo', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/logo.svg'));
  matIconRegistry.addSvgIcon('glass', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/glass.svg'));
  matIconRegistry.addSvgIcon('categories', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories.svg'));
  matIconRegistry.addSvgIcon('geo', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/geo.svg'));
  matIconRegistry.addSvgIcon('home', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/home.svg'));
  matIconRegistry.addSvgIcon('messages', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/messages.svg'));
  matIconRegistry.addSvgIcon('arrow-waterfall', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow-waterfall.svg'));
  matIconRegistry.addSvgIcon('arrow-right', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow-right.svg'));
  matIconRegistry.addSvgIcon('category_All', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_All.svg'));
  matIconRegistry.addSvgIcon('category_Appliances', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Appliances.svg'));
  matIconRegistry.addSvgIcon('category_Babies', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Babies.svg'));
  matIconRegistry.addSvgIcon('category_Cars', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Cars.svg'));
  matIconRegistry.addSvgIcon('category_Electronics', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Electronics.svg'));
  matIconRegistry.addSvgIcon('category_GamesBooks', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_GamesBooks.svg'));
  matIconRegistry.addSvgIcon('category_God', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_God.svg'));
  matIconRegistry.addSvgIcon('category_HomeGarden', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_HomeGarden.svg'));
  matIconRegistry.addSvgIcon('category_Housing', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Housing.svg'));
  matIconRegistry.addSvgIcon('category_Moda', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Moda.svg'));
  matIconRegistry.addSvgIcon('category_Motor', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Motor.svg'));
  matIconRegistry.addSvgIcon('category_Others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Others.svg'));
  matIconRegistry.addSvgIcon('category_Services', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Services.svg'));
  matIconRegistry.addSvgIcon('category_Sports', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Sports.svg'));
  matIconRegistry.addSvgIcon('category_Videogames', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Videogames.svg'));
  matIconRegistry.addSvgIcon('cat_laundry', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Appliances.svg'));
  matIconRegistry.addSvgIcon('cat_baby_car', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Babies.svg'));
  matIconRegistry.addSvgIcon('cat_smartphone', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Electronics.svg'));
  matIconRegistry.addSvgIcon('cat_bookshelf', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_GamesBooks.svg'));
  matIconRegistry.addSvgIcon('cat_furniture', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_HomeGarden.svg'));
  matIconRegistry.addSvgIcon('cat_house', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Housing.svg'));
  matIconRegistry.addSvgIcon('cat_t-shirt', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Moda.svg'));
  matIconRegistry.addSvgIcon('cat_helmet', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Motor.svg'));
  matIconRegistry.addSvgIcon('cat_ghost', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Others.svg'));
  matIconRegistry.addSvgIcon('cat_toolbox', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Services.svg'));
  matIconRegistry.addSvgIcon('cat_ball', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Sports.svg'));
  matIconRegistry.addSvgIcon('cat_gamepad', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/category_Videogames.svg'));
  matIconRegistry.addSvgIcon('send', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/send.svg'));
  matIconRegistry.addSvgIcon('wall', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wall.svg'));
  matIconRegistry.addSvgIcon('check', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/check.svg'));
  matIconRegistry.addSvgIcon('navigation_catalog', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_catalog.svg'));
  matIconRegistry.addSvgIcon('navigation_messages', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_messages.svg'));
  matIconRegistry.addSvgIcon('navigation_favorites', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_favorites.svg'));
  matIconRegistry.addSvgIcon('navigation_logout', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_logout.svg'));
  matIconRegistry.addSvgIcon('navigation_reviews', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_reviews.svg'));
  matIconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/delete.svg'));
  matIconRegistry.addSvgIcon('clock', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clock.svg'));
  matIconRegistry.addSvgIcon('back-arrow', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/back-arrow.svg'));
  matIconRegistry.addSvgIcon('commons-congrats', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/commons-congrats.svg'));
  matIconRegistry.addSvgIcon('congrats', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/congrats.svg'));
  matIconRegistry.addSvgIcon('items-empty-state', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/items-empty-state.svg'));
  matIconRegistry.addSvgIcon('feature', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/feature.svg'));
  matIconRegistry.addSvgIcon('shipping-available', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-available.svg'));
  matIconRegistry.addSvgIcon('firm-price', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/firm-price.svg'));
  matIconRegistry.addSvgIcon('accept-trades', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/accept-trades.svg'));
  matIconRegistry.addSvgIcon('others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/others.svg'));
  matIconRegistry.addSvgIcon('move-shape', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/move-shape.svg'));
  matIconRegistry.addSvgIcon('electric-hybrid', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/electric.svg'));
  matIconRegistry.addSvgIcon('manual', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/manual.svg'));
  matIconRegistry.addSvgIcon('automatic', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/automatic.svg'));
  matIconRegistry.addSvgIcon('gasoil', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/gasoil.svg'));
  matIconRegistry.addSvgIcon('gasoline', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/gasoline.svg'));
  matIconRegistry.addSvgIcon('shipping-5', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-5.svg'));
  matIconRegistry.addSvgIcon('shipping-10', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-10.svg'));
  matIconRegistry.addSvgIcon('shipping-20', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-20.svg'));
  matIconRegistry.addSvgIcon('shipping-30', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/shipping-30.svg'));
  matIconRegistry.addSvgIcon('upload-dnd', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/upload-dnd.svg'));
  matIconRegistry.addSvgIcon('ios', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/ios.svg'));
  matIconRegistry.addSvgIcon('android', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/android.svg'));
  matIconRegistry.addSvgIcon('herocat-cars', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-cars.svg'));
  matIconRegistry.addSvgIcon('herocat-consumer-goods', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-consumer-goods.svg'));
  matIconRegistry.addSvgIcon('herocat-real-estate', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-real-estate.svg'));
  matIconRegistry.addSvgIcon('herocat-services', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-services.svg'));
  matIconRegistry.addSvgIcon('cm-camera', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-camera.svg'));
  matIconRegistry.addSvgIcon('cm-drag', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-drag.svg'));
  matIconRegistry.addSvgIcon('cm-speaker', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-speaker.svg'));
  matIconRegistry.addSvgIcon('cm-question', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-question.svg'));
  matIconRegistry.addSvgIcon('cm-categories', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-categories.svg'));
  matIconRegistry.addSvgIcon('cm-chat', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-chat.svg'));
  matIconRegistry.addSvgIcon('cm-eye', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-eye.svg'));
  matIconRegistry.addSvgIcon('cm-car', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-car.svg'));
  matIconRegistry.addSvgIcon('cm-money', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-money.svg'));
  matIconRegistry.addSvgIcon('cm-seats', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-seats.svg'));
  matIconRegistry.addSvgIcon('cm-velocity', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-velocity.svg'));
  matIconRegistry.addSvgIcon('cm-hero', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-hero.svg'));
  matIconRegistry.addSvgIcon('cm-location', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-location.svg'));
  matIconRegistry.addSvgIcon('cm-shipping', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-shipping.svg'));
  matIconRegistry.addSvgIcon('twitter', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/twitter.svg'));
  matIconRegistry.addSvgIcon('facebook', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/facebook.svg'));
  matIconRegistry.addSvgIcon('car-type-small_car', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/small_car.svg'));
  matIconRegistry.addSvgIcon('car-type-coupe_cabrio', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/coupe_cabrio.svg'));
  matIconRegistry.addSvgIcon('car-type-sedan', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/sedan.svg'));
  matIconRegistry.addSvgIcon('car-type-family_car', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/family_car.svg'));
  matIconRegistry.addSvgIcon('car-type-mini_van', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/mini_van.svg'));
  matIconRegistry.addSvgIcon('car-type-4X4', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/4X4.svg'));
  matIconRegistry.addSvgIcon('car-type-van', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/van.svg'));
  matIconRegistry.addSvgIcon('car-type-others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/others.svg'));
  matIconRegistry.addSvgIcon('reviews-empty-state', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/reviews-empty-state.svg'));
  matIconRegistry.addSvgIcon('male', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/male.svg'));
  matIconRegistry.addSvgIcon('female', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/female.svg'));
  matIconRegistry.addSvgIcon('btn-delete', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/btn-delete.svg'));
  matIconRegistry.addSvgIcon('btn-edit', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/btn-edit.svg'));
  matIconRegistry.addSvgIcon('btn-reserved', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/btn-reserved.svg'));
  matIconRegistry.addSvgIcon('btn-sold', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/btn-sold.svg'));
  matIconRegistry.addSvgIcon('favorites-empty-state', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/favorites-empty-state.svg'));
  matIconRegistry.addSvgIcon('radio-button', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/radio-button.svg'));
  matIconRegistry.addSvgIcon('bump-city', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bump-city.svg'));
  matIconRegistry.addSvgIcon('bump-country', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bump-country.svg'));
  matIconRegistry.addSvgIcon('bump-zone', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bump-zone.svg'));
  matIconRegistry.addSvgIcon('wing-citybump', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wing-city.svg'));
  matIconRegistry.addSvgIcon('wing-countrybump', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wing-country.svg'));
  matIconRegistry.addSvgIcon('wing-zonebump', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wing-zone.svg'));
  matIconRegistry.addSvgIcon('wing', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wing.svg'));
  matIconRegistry.addSvgIcon('remove', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/remove.svg'));
  matIconRegistry.addSvgIcon('card', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/card.svg'));
  matIconRegistry.addSvgIcon('urgent', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/urgent.svg'));
}
