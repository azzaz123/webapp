import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AdComponent } from './ad/ad.component';
import { DateUntilDayPipe, DateCalendarPipe } from './pipes';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CardModule } from './card/card.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeolocationModule } from './geolocation/geolocation.module';
import { ExitConfirmGuard } from './guards/exit-confirm.guard';
import { RestrictInputDirective } from './restrict-input/restrict-input.directive';
import { HeaderComponent } from './header/header.component';
import { ButtonComponent } from './button/button.component';
import { SoldModalComponent } from './modals/sold-modal/sold-modal.component';
import { ReviewModalComponent } from './modals/review-modal/review-modal.component';
import { ItemSoldDirective } from './modals/sold-modal/item-sold.directive';
import { StarsRateComponent } from './stars-rate/stars-rate.component';
import { ProcessAllButtonComponent } from './process-all-button/process-all-button.component';
import { ArchivableComponent } from './archivable/archivable.component';
import { ArchiveButtonComponent } from './archive-button/archive-button.component';
import { UnarchiveButtonComponent } from './unarchive-button/unarchive-button.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SwitchComponent } from './switch/switch.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectComponent } from './select/select.component';
import { TooManyItemsModalComponent } from './catalog/modals/too-many-items-modal/too-many-items-modal.component';
import { AlreadyFeaturedModalComponent } from './catalog/modals/already-featured-modal/already-featured-modal.component';
import { RestrictInputNumberDirective } from './restrict-input-number/restrict-input-number.directive';
import { WallacoinComponent } from './payments/wallacoin/wallacoin.component';
import { ProfileFormComponent } from './profile/profile-form/profile-form.component';
import { EditEmailComponent } from './profile/edit-email/edit-email.component';
import { EmailModalComponent } from './profile/edit-email/email-modal/email-modal.component';
import { EditPasswordComponent } from './profile/edit-password/edit-password.component';
import { PasswordModalComponent } from './profile/edit-password/password-modal/password-modal.component';
import { PictureUploadComponent } from './profile/picture-upload/picture-upload.component';
import { CreditCardInfoComponent } from './profile/credit-card-info/credit-card-info.component';
import { CatalogCardComponent } from './catalog/catalog-card/catalog-card.component';
import { CatalogItemActionsComponent } from './catalog/catalog-item-actions/catalog-item-actions.component';
import { CatalogStatusNavbarComponent } from './catalog/catalog-status-navbar/catalog-status-navbar.component';
import { CartComponent } from './catalog/cart/cart.component';
import { CartService } from './catalog/cart/cart.service';
import { TrackingModule } from '../core/tracking/tracking.module';
import { RouterModule } from '@angular/router';
import { ExitConfirmationModalComponent } from './exit-confirmation-modal/exit-confirmation-modal.component';
import { CountdownComponent } from './countdown/countdown.component';
import { ThousandSuffixesPipe } from './number-conversion/thousand-suffixes.pipe';
import { ActivateItemsModalComponent } from './catalog/catalog-item-actions/activate-items-modal/activate-items-modal.component';
import { DeactivateItemsModalComponent } from './catalog/catalog-item-actions/deactivate-items-modal/deactivate-items-modal.component';
import { UploaderModule } from './uploader/uploader.module';
import { UserCoverComponent } from './user-cover/user-cover.component';
import { CoverUploadComponent } from './profile/cover-upload/cover-upload.component';
import { KeywordSuggesterComponent } from './keyword-suggester/keyword-suggester.component';
import { StripeCardElementComponent } from './payments/stripe/stripe-card-element.component';
import { StripeCardsComponent } from './profile/stripe-cards/stripe-cards.component';
import { NewCardModalComponent } from './modals/new-card-modal/new-card-modal.component';
import { NoCardModalComponent } from './modals/no-card-modal/no-card-modal.component';
import { StripeCardSelectionComponent } from './payments/stripe-card-selection/stripe-card-selection.component';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { LinkTransformPipe } from './pipes';
import { NavLinksComponent } from './nav-links/nav-links.component';
import { SubscriptionsService } from '../core/subscriptions/subscriptions.service';
import { PreventDoubleClickDirective } from './prevent-double-click/prevent-double-click.directive';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ProBadgeModule } from './pro-badge/pro-badge.module';
import { StatusIconComponent } from './status-icon';
import { ChangeCardModalComponent } from './modals/change-card-modal/change-card-modal.component';
import { ConfirmCardModalComponent } from './modals/confirm-card-modal/confirm-card-modal.component';
import { ProfileProBillingComponent } from './profile-pro-billing/profile-pro-billing.component';
import { FullScreenModalComponent } from './modals/full-screen-menu/full-screen-modal.component';
import { DisableControlDirective } from './forms/disable-control.directive';
import { RouterLinkDirectiveStub } from './router-link-directive-stub';
import { SvgIconModule } from 'app/core/svg-icon/svg-icon.module';
import { DateCountDownComponent } from './date-countdown/date-countdown.component';
import { ItemAvatarModule } from './item-avatar/item-avatar.module';
import { StarsModule } from './stars/stars.module';
import { UserAvatarModule } from './user-avatar/user-avatar.module';
import { SpinnerModule } from './spinner/spinner.module';
import { SanitizedBackgroundModule } from './sanitized-background/sanitized-background.module';
import { UserCoverModule } from './user-cover/user-cover.module';
import { WallacoinsDisabledModalComponent } from './modals/wallacoins-disabled-modal/wallacoins-disabled-modal.component';
import { CustomCurrencyModule } from './pipes/custom-currency/custom-currency.module';
import { BumpSuggestionModalComponent } from './modals/bump-suggestion-modal/bump-suggestion-modal.component';
import { SocialShareService } from '@core/social-share/social-share.service';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    GeolocationModule,
    NgxPermissionsModule.forChild(),
    TrackingModule,
    RouterModule,
    UploaderModule,
    DeviceDetectorModule.forRoot(),
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
  ],
  exports: [
    SpinnerModule,
    SanitizedBackgroundModule,
    UserAvatarModule,
    StarsModule,
    CardModule,
    CommonModule,
    UploaderModule,
    AdComponent,
    RestrictInputDirective,
    HeaderComponent,
    ButtonComponent,
    SoldModalComponent,
    ItemSoldDirective,
    StarsRateComponent,
    StatusIconComponent,
    ProcessAllButtonComponent,
    ArchivableComponent,
    ArchiveButtonComponent,
    UnarchiveButtonComponent,
    SwitchComponent,
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
    ProfileFormComponent,
    CreditCardInfoComponent,
    CatalogCardComponent,
    CatalogItemActionsComponent,
    CatalogStatusNavbarComponent,
    CartComponent,
    ExitConfirmationModalComponent,
    CountdownComponent,
    ThousandSuffixesPipe,
    CoverUploadComponent,
    KeywordSuggesterComponent,
    StripeCardElementComponent,
    StripeCardsComponent,
    NewCardModalComponent,
    NoCardModalComponent,
    ConfirmCardModalComponent,
    ChangeCardModalComponent,
    StripeCardSelectionComponent,
    NavLinksComponent,
    LinkTransformPipe,
    PreventDoubleClickDirective,
    ProBadgeModule,
    DateUntilDayPipe,
    DateCalendarPipe,
    ProfileProBillingComponent,
    FullScreenModalComponent,
    DisableControlDirective,
    SvgIconModule,
    DateCountDownComponent,
    DropdownModule,
    WallacoinsDisabledModalComponent,
  ],
  declarations: [
    AdComponent,
    ConfirmationModalComponent,
    RestrictInputDirective,
    HeaderComponent,
    ButtonComponent,
    SoldModalComponent,
    ItemSoldDirective,
    StarsRateComponent,
    StatusIconComponent,
    ProcessAllButtonComponent,
    ArchivableComponent,
    ArchiveButtonComponent,
    UnarchiveButtonComponent,
    ReviewModalComponent,
    SwitchComponent,
    ReviewModalComponent,
    CheckboxComponent,
    SelectComponent,
    SearchInputComponent,
    TooManyItemsModalComponent,
    AlreadyFeaturedModalComponent,
    RestrictInputNumberDirective,
    WallacoinComponent,
    EditEmailComponent,
    EmailModalComponent,
    EditPasswordComponent,
    PasswordModalComponent,
    PictureUploadComponent,
    ProfileFormComponent,
    CreditCardInfoComponent,
    CatalogCardComponent,
    CatalogItemActionsComponent,
    CatalogStatusNavbarComponent,
    CartComponent,
    ExitConfirmationModalComponent,
    CountdownComponent,
    ThousandSuffixesPipe,
    ActivateItemsModalComponent,
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
    NavLinksComponent,
    LinkTransformPipe,
    PreventDoubleClickDirective,
    DateUntilDayPipe,
    DateCalendarPipe,
    ProfileProBillingComponent,
    FullScreenModalComponent,
    DisableControlDirective,
    RouterLinkDirectiveStub,
    DateCountDownComponent,
    BumpSuggestionModalComponent,
    WallacoinsDisabledModalComponent,
  ],
  providers: [
    DecimalPipe,
    ExitConfirmGuard,
    CartService,
    ThousandSuffixesPipe,
    LinkTransformPipe,
    SubscriptionsService,
    SocialShareService,
  ],
  entryComponents: [
    ConfirmationModalComponent,
    SoldModalComponent,
    ReviewModalComponent,
    TooManyItemsModalComponent,
    AlreadyFeaturedModalComponent,
    EmailModalComponent,
    PasswordModalComponent,
    ExitConfirmationModalComponent,
    ActivateItemsModalComponent,
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
