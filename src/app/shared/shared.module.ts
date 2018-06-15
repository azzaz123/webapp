import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatIconModule } from '@angular/material';
import { AdComponent } from './ad/ad.component';
import { CustomCurrencyPipe } from './custom-currency/custom-currency.pipe';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CardModule } from './card/card.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeolocationModule } from './geolocation/geolocation.module';
import { ExitConfirmGuard } from './guards/exit-confirm.guard';
import { RestrictInputDirective } from './restrict-input/restrict-input.directive';
import { TutorialGuard } from './guards/tutorial.guard';
import { HeaderComponent } from './header/header.component';
import { ButtonComponent } from './button/button.component';
import { SoldModalComponent } from './modals/sold-modal/sold-modal.component';
import { ReviewModalComponent } from './modals/review-modal/review-modal.component';
import { ItemSoldDirective } from './modals/sold-modal/item-sold.directive';
import { StarsRateComponent } from './stars-rate/stars-rate.component';
import { StarsComponent } from './stars/stars.component';
import { SanitizedBackgroundDirective } from './sanitized-background/sanitized-background.directive';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ProcessAllButtonComponent } from './process-all-button/process-all-button.component';
import { ArchivableComponent } from './archivable/archivable.component';
import { ArchiveButtonComponent } from './archive-button/archive-button.component';
import { UnarchiveButtonComponent } from './unarchive-button/unarchive-button.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MessageComponent } from './message/message.component';
import { ReviewButtonComponent } from './message/review-button/review-button.component';
import { SwitchComponent } from './switch/switch.component';
import { GdprModalComponent } from './gdpr-modal/gdpr-modal.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ItemAvatarComponent } from './item-avatar/item-avatar.component';
import { MomentModule } from 'angular2-moment';
import { SearchInputComponent } from './search-input/search-input.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectComponent } from './select/select.component';
import { TooManyItemsModalComponent } from './catalog/modals/too-many-items-modal/too-many-items-modal.component';
import { AlreadyFeaturedModalComponent } from './catalog/modals/already-featured-modal/already-featured-modal.component';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    MatIconModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    GeolocationModule,
    MomentModule,
    NgxPermissionsModule,
    NgbDropdownModule
  ],
  exports: [
    CardModule,
    CommonModule,
    SpinnerComponent,
    AdComponent,
    CustomCurrencyPipe,
    RestrictInputDirective,
    HeaderComponent,
    ButtonComponent,
    SoldModalComponent,
    ItemSoldDirective,
    SanitizedBackgroundDirective,
    StarsComponent,
    StarsRateComponent,
    UserAvatarComponent,
    ProcessAllButtonComponent,
    ArchivableComponent,
    ArchiveButtonComponent,
    UnarchiveButtonComponent,
    SwitchComponent,
    ReviewModalComponent,
    NgxPermissionsModule,
    GdprModalComponent,
    MessageComponent,
    ReviewButtonComponent,
    ConversationComponent,
    ItemAvatarComponent,
    SearchInputComponent,
    SelectComponent
  ],
  declarations: [
    AdComponent,
    ConfirmationModalComponent,
    SpinnerComponent,
    CustomCurrencyPipe,
    RestrictInputDirective,
    HeaderComponent,
    ButtonComponent,
    SoldModalComponent,
    ItemSoldDirective,
    SanitizedBackgroundDirective,
    StarsComponent,
    StarsRateComponent,
    UserAvatarComponent,
    ProcessAllButtonComponent,
    ArchivableComponent,
    ArchiveButtonComponent,
    UnarchiveButtonComponent,
    UserAvatarComponent,
    ReviewModalComponent,
    MessageComponent,
    ReviewButtonComponent,
    SwitchComponent,
    ReviewModalComponent,
    GdprModalComponent,
    CheckboxComponent,
    ConversationComponent,
    ItemAvatarComponent,
    SelectComponent,
    SearchInputComponent,
    TooManyItemsModalComponent,
    AlreadyFeaturedModalComponent
  ],
  providers: [
    DecimalPipe,
    ExitConfirmGuard,
    TutorialGuard
  ],
  entryComponents: [
    ConfirmationModalComponent,
    SoldModalComponent,
    ReviewModalComponent,
    GdprModalComponent,
    TooManyItemsModalComponent,
    AlreadyFeaturedModalComponent
  ]
})
export class SharedModule { }
