import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AdSlotModule } from './ads/ad-slot/ad-slot.module';
import { ArchivableComponent } from './archivable/archivable.component';
import { ArchiveButtonComponent } from './archive-button/archive-button.component';
import { ButtonModule } from './button/button.module';
import { CardModule } from './card/card.module';
import { CartComponent } from './catalog/cart/cart.component';
import { CatalogCardComponent } from './catalog/catalog-card/catalog-card.component';
import { CatalogItemActionsComponent } from './catalog/catalog-item-actions/catalog-item-actions.component';
import { DeactivateItemsModalComponent } from './catalog/catalog-item-actions/deactivate-items-modal/deactivate-items-modal.component';
import { CatalogStatusNavbarComponent } from './catalog/catalog-status-navbar/catalog-status-navbar.component';
import { AlreadyFeaturedModalComponent } from './catalog/modals/already-featured-modal/already-featured-modal.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CountdownComponent } from './countdown/countdown.component';
import { ExitConfirmationModalComponent } from './exit-confirmation-modal/exit-confirmation-modal.component';
import { DisableControlDirective } from './forms/disable-control.directive';
import { GeolocationModule } from './geolocation/geolocation.module';
import { ItemAvatarModule } from './item-avatar/item-avatar.module';
import { KeywordSuggesterComponent } from './keyword-suggester/keyword-suggester.component';
import { BumpSuggestionModalComponent } from './modals/bump-suggestion-modal/bump-suggestion-modal.component';
import { ChangeCardModalComponent } from './modals/change-card-modal/change-card-modal.component';
import { ConfirmCardModalComponent } from './modals/confirm-card-modal/confirm-card-modal.component';
import { FullScreenModalComponent } from './modals/full-screen-menu/full-screen-modal.component';
import { NewCardModalComponent } from './modals/new-card-modal/new-card-modal.component';
import { NoCardModalComponent } from './modals/no-card-modal/no-card-modal.component';
import { ReviewModalComponent } from './modals/review-modal/review-modal.component';
import { ItemSoldDirective } from './modals/sold-modal/item-sold.directive';
import { SoldModalComponent } from './modals/sold-modal/sold-modal.component';
import { WallacoinsDisabledModalComponent } from './modals/wallacoins-disabled-modal/wallacoins-disabled-modal.component';
import { StripeCardSelectionComponent } from './payments/stripe-card-selection/stripe-card-selection.component';
import { StripeCardElementComponent } from './payments/stripe/stripe-card-element.component';
import { WallacoinComponent } from './payments/wallacoin/wallacoin.component';
import {
  DateCalendarPipe,
  DateUntilDayPipe,
  LinkTransformPipe,
  WebSlugConverterPipe,
  UserProfileRoutePipe,
  ItemDetailRoutePipe,
} from './pipes';
import { CustomCurrencyModule } from './pipes/custom-currency/custom-currency.module';
import { PreventDoubleClickDirective } from './prevent-double-click/prevent-double-click.directive';
import { ProBadgeModule } from './pro-badge/pro-badge.module';
import { ProcessAllButtonComponent } from './process-all-button/process-all-button.component';
import { CoverUploadComponent } from './profile/cover-upload/cover-upload.component';
import { EditEmailComponent } from './profile/edit-email/edit-email.component';
import { EmailModalComponent } from './profile/edit-email/email-modal/email-modal.component';
import { EditPasswordComponent } from './profile/edit-password/edit-password.component';
import { PasswordModalComponent } from './profile/edit-password/password-modal/password-modal.component';
import { PictureUploadComponent } from './profile/picture-upload/picture-upload.component';
import { StripeCardsComponent } from './profile/stripe-cards/stripe-cards.component';
import { RestrictInputNumberDirective } from './restrict-input-number/restrict-input-number.directive';
import { RestrictInputDirective } from './restrict-input/restrict-input.directive';
import { SanitizedBackgroundModule } from './sanitized-background/sanitized-background.module';
import { SearchInputComponent } from './search-input/search-input.component';
import { SelectComponent } from './select/select.component';
import { SpinnerModule } from './spinner/spinner.module';
import { StarsRateComponent } from './stars-rate/stars-rate.component';
import { StarsModule } from './stars/stars.module';
import { StatusIconComponent } from './status-icon';
import { UnarchiveButtonComponent } from './unarchive-button/unarchive-button.component';
import { UploaderModule } from './uploader/uploader.module';
import { UserAvatarModule } from './user-avatar/user-avatar.module';
import { UserCoverModule } from './user-cover/user-cover.module';
import { DateCountDownModule } from './date-countdown/date-countdown.module';
import { SuggestProModalComponent } from './catalog/modals/suggest-pro-modal/suggest-pro-modal.component';
import { DeliveryDevelopmentDirective } from './directives/delivery-development/delivery-development.directive';
import { ProfileFormModule } from './profile/profile-form/profile-form.module';
import { HeaderModule } from './header/header.module';
import { VisibleDirectiveModule } from './directives/visible/visible.directive.module';
import { LocationSelectorModal } from './modals/location-selector-modal/location-selector-modal.component';
import { PaymentsCardInfoModule } from './payments-card-info/payments-card-info.module';
import { InfiniteScrollModule } from './infinite-scroll/infinite-scroll.module';
import { InfiniteScrollDirective } from './infinite-scroll/infinite-scroll.directive';
import { RouterLinkModule } from './router-link/router-link.module';
import { ListingLimitService } from '@core/subscriptions/listing-limit/listing-limit.service';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    GeolocationModule,
    NgxPermissionsModule.forChild(),
    RouterModule,
    UploaderModule,
    ProBadgeModule,
    SvgIconModule,
    DropdownModule,
    ItemAvatarModule,
    SanitizedBackgroundModule,
    CustomCurrencyModule,
    StarsModule,
    UserAvatarModule,
    SanitizedBackgroundModule,
    SpinnerModule,
    UserCoverModule,
    ButtonModule,
    DateCountDownModule,
    ProfileFormModule,
    HeaderModule,
    PaymentsCardInfoModule,
    InfiniteScrollModule,
  ],
  exports: [
    SpinnerModule,
    SanitizedBackgroundModule,
    UserAvatarModule,
    StarsModule,
    CardModule,
    CommonModule,
    UploaderModule,
    AdSlotModule,
    RestrictInputDirective,
    HeaderModule,
    SoldModalComponent,
    ItemSoldDirective,
    StarsRateComponent,
    StatusIconComponent,
    ProcessAllButtonComponent,
    ArchivableComponent,
    ArchiveButtonComponent,
    UnarchiveButtonComponent,
    ReviewModalComponent,
    NgxPermissionsModule,
    SearchInputComponent,
    SelectComponent,
    RestrictInputNumberDirective,
    WallacoinComponent,
    EditEmailComponent,
    EmailModalComponent,
    EditPasswordComponent,
    PasswordModalComponent,
    PictureUploadComponent,
    CatalogCardComponent,
    CatalogItemActionsComponent,
    CatalogStatusNavbarComponent,
    CartComponent,
    ExitConfirmationModalComponent,
    CountdownComponent,
    CoverUploadComponent,
    KeywordSuggesterComponent,
    StripeCardElementComponent,
    StripeCardsComponent,
    NewCardModalComponent,
    NoCardModalComponent,
    ConfirmCardModalComponent,
    ChangeCardModalComponent,
    StripeCardSelectionComponent,
    LinkTransformPipe,
    WebSlugConverterPipe,
    UserProfileRoutePipe,
    ItemDetailRoutePipe,
    PreventDoubleClickDirective,
    ProBadgeModule,
    DateUntilDayPipe,
    DateCalendarPipe,
    FullScreenModalComponent,
    DisableControlDirective,
    SvgIconModule,
    DropdownModule,
    WallacoinsDisabledModalComponent,
    ButtonModule,
    DateCountDownModule,
    SuggestProModalComponent,
    DeliveryDevelopmentDirective,
    ProfileFormModule,
    InfiniteScrollDirective,
    VisibleDirectiveModule,
    PaymentsCardInfoModule,
    RouterLinkModule,
  ],
  declarations: [
    ConfirmationModalComponent,
    RestrictInputDirective,
    SoldModalComponent,
    ItemSoldDirective,
    StarsRateComponent,
    StatusIconComponent,
    ProcessAllButtonComponent,
    ArchivableComponent,
    ArchiveButtonComponent,
    UnarchiveButtonComponent,
    ReviewModalComponent,
    ReviewModalComponent,
    CheckboxComponent,
    SelectComponent,
    SearchInputComponent,
    AlreadyFeaturedModalComponent,
    RestrictInputNumberDirective,
    WallacoinComponent,
    EditEmailComponent,
    EmailModalComponent,
    EditPasswordComponent,
    PasswordModalComponent,
    PictureUploadComponent,
    CatalogCardComponent,
    CatalogItemActionsComponent,
    CatalogStatusNavbarComponent,
    CartComponent,
    ExitConfirmationModalComponent,
    CountdownComponent,
    DeactivateItemsModalComponent,
    CoverUploadComponent,
    KeywordSuggesterComponent,
    StripeCardElementComponent,
    StripeCardsComponent,
    NewCardModalComponent,
    NoCardModalComponent,
    ConfirmCardModalComponent,
    ChangeCardModalComponent,
    StripeCardSelectionComponent,
    LinkTransformPipe,
    WebSlugConverterPipe,
    UserProfileRoutePipe,
    ItemDetailRoutePipe,
    PreventDoubleClickDirective,
    DateUntilDayPipe,
    DateCalendarPipe,
    FullScreenModalComponent,
    DisableControlDirective,
    BumpSuggestionModalComponent,
    WallacoinsDisabledModalComponent,
    SuggestProModalComponent,
    DeliveryDevelopmentDirective,
    LocationSelectorModal,
  ],
  providers: [DecimalPipe, LinkTransformPipe, ItemDetailRoutePipe, ListingLimitService],
  entryComponents: [
    ConfirmationModalComponent,
    SoldModalComponent,
    ReviewModalComponent,
    AlreadyFeaturedModalComponent,
    EmailModalComponent,
    PasswordModalComponent,
    ExitConfirmationModalComponent,
    DeactivateItemsModalComponent,
    NewCardModalComponent,
    NoCardModalComponent,
    ConfirmCardModalComponent,
    ChangeCardModalComponent,
    FullScreenModalComponent,
    WallacoinsDisabledModalComponent,
  ],
})
export class SharedModule {}
