import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

export function configIcons(matIconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
  matIconRegistry.addSvgIcon('heart', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/heart.svg'));
  matIconRegistry.addSvgIcon('location', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/location.svg'));
  matIconRegistry.addSvgIcon('others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/others.svg'));
  matIconRegistry.addSvgIcon('phone', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/phone.svg'));
  matIconRegistry.addSvgIcon('messages-icon', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/messages-icon.svg'));
  matIconRegistry.addSvgIcon('ico-message', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/ico-message.svg'));
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
  matIconRegistry.addSvgIcon('not-available', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/warning.svg'));
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
  matIconRegistry.addSvgIcon('cat_motorbike', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/motos.svg'));
  matIconRegistry.addSvgIcon('cat_tv', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/tv.svg'));
  matIconRegistry.addSvgIcon('cat_pc', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/computing.svg'));
  matIconRegistry.addSvgIcon('cat_phone', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/electronics.svg'));
  matIconRegistry.addSvgIcon('cat_bike', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/bikes.svg'));
  matIconRegistry.addSvgIcon('cat_collecting', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/collecting.svg'));
  matIconRegistry.addSvgIcon('cat_building', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/construction.svg'));
  matIconRegistry.addSvgIcon('cat_farming', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/agriculture.svg'));
  matIconRegistry.addSvgIcon('cat_jobs', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/stroke/job.svg'));
  matIconRegistry.addSvgIcon('send', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/send.svg'));
  matIconRegistry.addSvgIcon('wall', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wall.svg'));
  matIconRegistry.addSvgIcon('check', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/check.svg'));
  matIconRegistry.addSvgIcon('navigation_catalog', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_catalog.svg'));
  matIconRegistry.addSvgIcon('navigation_messages', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_messages.svg'));
  matIconRegistry.addSvgIcon('navigation_favorites', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_favorites.svg'));
  matIconRegistry.addSvgIcon('navigation_logout', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_logout.svg'));
  matIconRegistry.addSvgIcon('navigation_reviews', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_reviews.svg'));
  matIconRegistry.addSvgIcon('navigation_dashboard', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_dashboard.svg'));
  matIconRegistry.addSvgIcon('navigation_phones', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_phones.svg'));
  matIconRegistry.addSvgIcon('navigation_help', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_help.svg'));
  matIconRegistry.addSvgIcon('navigation_wallacoins', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/navigation_wallacoins.svg'));
  matIconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/delete.svg'));
  matIconRegistry.addSvgIcon('clock', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clock.svg'));
  matIconRegistry.addSvgIcon('back-arrow', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/back-arrow.svg'));
  matIconRegistry.addSvgIcon('commons-congrats', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/commons-congrats.svg'));
  matIconRegistry.addSvgIcon('congrats', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/congrats.svg'));
  matIconRegistry.addSvgIcon('items-empty-state', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/items-empty-state.svg'));
  matIconRegistry.addSvgIcon('pro-items-empty-state', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/pro-items-empty-state.svg'));
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
  matIconRegistry.addSvgIcon('herocat-jobs', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/herocat-jobs.svg'));
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
  matIconRegistry.addSvgIcon('cm-urgent', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cm-urgent.svg'));
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
  matIconRegistry.addSvgIcon('bump-city-small', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bump-city-small.svg'));
  matIconRegistry.addSvgIcon('bump-country-small', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bump-country-small.svg'));
  matIconRegistry.addSvgIcon('wing-citybump', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wing-city.svg'));
  matIconRegistry.addSvgIcon('wing-countrybump', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wing-country.svg'));
  matIconRegistry.addSvgIcon('wing-zonebump', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wing-zone.svg'));
  matIconRegistry.addSvgIcon('wing', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wing.svg'));
  matIconRegistry.addSvgIcon('remove', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/remove.svg'));
  matIconRegistry.addSvgIcon('card', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/card.svg'));
  matIconRegistry.addSvgIcon('urgent', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/urgent.svg'));
  matIconRegistry.addSvgIcon('process-all', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/process-all.svg'));
  matIconRegistry.addSvgIcon('call-shared', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/call-shared.svg'));
  matIconRegistry.addSvgIcon('call-received', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/call-received.svg'));
  matIconRegistry.addSvgIcon('arrow-back', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/arrow-back.svg'));
  matIconRegistry.addSvgIcon('car', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/car.svg'));
  matIconRegistry.addSvgIcon('empty-state-phones', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/empty-state-phones.svg'));
  matIconRegistry.addSvgIcon('bump-country-pro', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bump-country-pro.svg'));
  matIconRegistry.addSvgIcon('bump-city-pro', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/bump-city-pro.svg'));
  matIconRegistry.addSvgIcon('plan-10', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan10.svg'));
  matIconRegistry.addSvgIcon('plan-10-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan10_selected.svg'));
  matIconRegistry.addSvgIcon('plan-20', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan20.svg'));
  matIconRegistry.addSvgIcon('plan-20-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan20_selected.svg'));
  matIconRegistry.addSvgIcon('plan-30', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan30.svg'));
  matIconRegistry.addSvgIcon('plan-30-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan30_selected.svg'));
  matIconRegistry.addSvgIcon('plan-50', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan50.svg'));
  matIconRegistry.addSvgIcon('plan-50-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan50_selected.svg'));
  matIconRegistry.addSvgIcon('plan-75', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan75.svg'));
  matIconRegistry.addSvgIcon('plan-75-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan75_selected.svg'));
  matIconRegistry.addSvgIcon('plan-100', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan100.svg'));
  matIconRegistry.addSvgIcon('plan-100-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan100_selected.svg'));
  matIconRegistry.addSvgIcon('plan-150', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan150.svg'));
  matIconRegistry.addSvgIcon('plan-150-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan150_selected.svg'));
  matIconRegistry.addSvgIcon('plan-200', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan200.svg'));
  matIconRegistry.addSvgIcon('plan-200-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/plan200_selected.svg'));
  matIconRegistry.addSvgIcon('plan-personal', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/personal1.svg'));
  matIconRegistry.addSvgIcon('plan-personal-selected', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/personal1_selected.svg'));
  matIconRegistry.addSvgIcon('plan-personal-plus', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/plans/personal2.svg'));
  matIconRegistry.addSvgIcon('secure-card', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/secure-card.svg'));
  matIconRegistry.addSvgIcon('category_All', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/allcategories.svg'));
  matIconRegistry.addSvgIcon('category_Motorbike', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/motos.svg'));
  matIconRegistry.addSvgIcon('category_Cars', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/cars.svg'));
  matIconRegistry.addSvgIcon('category_MotorAccessories', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/motoraccesories.svg'));
  matIconRegistry.addSvgIcon('category_TVAudioCameras', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/tv.svg'));
  matIconRegistry.addSvgIcon('category_ComputersElectronic', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/computing.svg'));
  matIconRegistry.addSvgIcon('category_CellPhonesAccessories', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/electronics.svg'));
  matIconRegistry.addSvgIcon('category_SportsLeisure', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/sports.svg'));
  matIconRegistry.addSvgIcon('category_Bikes', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/bikes.svg'));
  matIconRegistry.addSvgIcon('category_GamesConsoles', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/gaming.svg'));
  matIconRegistry.addSvgIcon('category_HomeGarden', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/home.svg'));
  matIconRegistry.addSvgIcon('category_FashionAccessories', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/fashion.svg'));
  matIconRegistry.addSvgIcon('category_Appliances', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/electrodomestics.svg'));
  matIconRegistry.addSvgIcon('category_GamesBooks', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/movies.svg'));
  matIconRegistry.addSvgIcon('category_BabiesChild', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/babys.svg'));
  matIconRegistry.addSvgIcon('category_CollectiblesArt', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/collecting.svg'));
  matIconRegistry.addSvgIcon('category_Construction', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/construction.svg'));
  matIconRegistry.addSvgIcon('category_AgricultureIndustrial', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/agriculture.svg'));
  matIconRegistry.addSvgIcon('category_Jobs', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/job.svg'));
  matIconRegistry.addSvgIcon('category_RealEstate', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/realstate.svg'));
  matIconRegistry.addSvgIcon('category_Services', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/services.svg'));
  matIconRegistry.addSvgIcon('category_Others', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/normal/others.svg'));
  matIconRegistry.addSvgIcon('category_All-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/allcategories.svg'));
  matIconRegistry.addSvgIcon('category_Motorbike-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/motos.svg'));
  matIconRegistry.addSvgIcon('category_Cars-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/cars.svg'));
  matIconRegistry.addSvgIcon('category_MotorAccessories-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/motoraccesories.svg'));
  matIconRegistry.addSvgIcon('category_TVAudioCameras-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/tv.svg'));
  matIconRegistry.addSvgIcon('category_ComputersElectronic-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/computing.svg'));
  matIconRegistry.addSvgIcon('category_CellPhonesAccessories-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/electronics.svg'));
  matIconRegistry.addSvgIcon('category_SportsLeisure-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/sports.svg'));
  matIconRegistry.addSvgIcon('category_Bikes-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/bikes.svg'));
  matIconRegistry.addSvgIcon('category_GamesConsoles-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/gaming.svg'));
  matIconRegistry.addSvgIcon('category_HomeGarden-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/home.svg'));
  matIconRegistry.addSvgIcon('category_FashionAccessories-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/fashion.svg'));
  matIconRegistry.addSvgIcon('category_Appliances-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/electrodomestics.svg'));
  matIconRegistry.addSvgIcon('category_GamesBooks-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/movies.svg'));
  matIconRegistry.addSvgIcon('category_BabiesChild-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/babys.svg'));
  matIconRegistry.addSvgIcon('category_CollectiblesArt-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/collecting.svg'));
  matIconRegistry.addSvgIcon('category_Construction-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/construction.svg'));
  matIconRegistry.addSvgIcon('category_AgricultureIndustrial-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/agriculture.svg'));
  matIconRegistry.addSvgIcon('category_Jobs-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/job.svg'));
  matIconRegistry.addSvgIcon('category_RealEstate-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/realstate.svg'));
  matIconRegistry.addSvgIcon('category_Services-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/services.svg'));
  matIconRegistry.addSvgIcon('category_Others-hover', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/categories/hover/others.svg'));
  matIconRegistry.addSvgIcon('buy', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/buy.svg'));
  matIconRegistry.addSvgIcon('rent', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/rent.svg'));
  matIconRegistry.addSvgIcon('apartment', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/apartment.svg'));
  matIconRegistry.addSvgIcon('garage', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/garage.svg'));
  matIconRegistry.addSvgIcon('house', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/house.svg'));
  matIconRegistry.addSvgIcon('land', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/land.svg'));
  matIconRegistry.addSvgIcon('office', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/office.svg'));
  matIconRegistry.addSvgIcon('room', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/room.svg'));
  matIconRegistry.addSvgIcon('elevator', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/elevator.svg'));
  matIconRegistry.addSvgIcon('garden', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/garden.svg'));
  matIconRegistry.addSvgIcon('pool', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/pool.svg'));
  matIconRegistry.addSvgIcon('terrace', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/terrace.svg'));
  matIconRegistry.addSvgIcon('box_room', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/box_room.svg'));
  matIconRegistry.addSvgIcon('faq-features-1', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/faq-features-1.svg'));
  matIconRegistry.addSvgIcon('faq-features-2', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/faq-features-2.svg'));
  matIconRegistry.addSvgIcon('faq-features-3', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/faq-features-3.svg'));
  matIconRegistry.addSvgIcon('wallacoins-nav', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/wallacoins-nav.svg'));
  matIconRegistry.addSvgIcon('coin', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/coin.svg'));
  matIconRegistry.addSvgIcon('slider-arrow', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/slider-arrow.svg'));
  matIconRegistry.addSvgIcon('up-arrow', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/up-arrow.svg'));
  matIconRegistry.addSvgIcon('up-arrow-white', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/up-arrow-white.svg'));
  matIconRegistry.addSvgIcon('listing-fee-car-icon', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/listing-fee-icon.svg'));
  matIconRegistry.addSvgIcon('listing-fee-car-icon-wings', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/listing-fee-icon-wings.svg'));
  matIconRegistry.addSvgIcon('pro-seal', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/pro-seal.svg'));
}
