import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ArchivedInboxConversationComponent } from '@private/features/chat/components/archived-inbox-conversation';
import {
  ArchiveInboxConversationComponent,
  BlockUserComponent,
  ReportListingComponent,
  ReportUserComponent,
  UnarchiveInboxConversationComponent,
  UnblockUserComponent,
} from '@private/features/chat/modals';
import { ChatApiModule } from '@api/chat/chat-api.module';
import { chatRoutedComponents, ChatRoutingModule } from '@private/features/chat/chat.routes';
import { ChatTranslationService } from '@private/features/chat/services/chat-translation/chat-translation.service';
import { ConnectionAlertComponent } from '@private/features/chat/components/connection-alert/inbox';
import { ConversationDetailsBarComponent } from '@private/features/chat/components/conversation-details-bar';
import { CurrentConversationComponent } from '@private/features/chat/components/current-conversation';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { DeliveryAddressService } from '@private/features/delivery/services/address/delivery-address/delivery-address.service';
import { DeliveryAddressStoreService } from '@private/features/delivery/services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryBannerModule } from '@private/features/chat/modules/delivery-banner/delivery-banner.module';
import { DeliveryBuyerCalculatorModule } from '@api/delivery/buyer/calculator/delivery-buyer-calculator.module';
import { DeliveryBuyerModule } from '@api/bff/delivery/buyer/delivery-buyer.module';
import { DeliveryConversationContextModule } from '@private/features/chat/modules/delivery-conversation-context/delivery-conversation-context.module';
import { DeliveryConversationContextService } from '@private/features/chat/modules/delivery-conversation-context/services/delivery-conversation-context/delivery-conversation-context.service';
import { DeliveryCostsModule } from '@api/bff/delivery/costs/delivery-costs.module';
import { InboxComponent } from '@private/features/chat/children/inbox/inbox.component';
import { InboxConversationComponent } from '@private/features/chat/children/inbox/components/inbox-conversation';
import { InboxItemDetailComponent } from '@private/features/chat/children/inbox/components/inbox-item-component';
import { InboxItemForSellComponent } from '@private/features/chat/children/inbox/components/inbox-item-for-sell/inbox-item-for-sell.component';
import { InboxUserDetailComponent } from '@private/features/chat/children/inbox/components/inbox-user-component';
import { InputComponent } from '@private/features/chat/components/input';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { ItemReservedComponent } from '@private/features/chat/children/item/components/item-reserved';
import { ItemSoldComponent } from '@private/features/chat/children/item/components/item-sold';
import { MaliciousConversationModalComponent } from '@private/features/chat/modals/malicious-conversation-modal/malicious-conversation-modal.component';
import { MessageModule } from '@private/features/chat/children/message';
import { PaymentsCreditCardModule } from '@api/payments/cards';
import { PaymentsPaymentMethodsModule } from '@api/payments/payment-methods/payments-payment-methods.module';
import { PaymentsUserPaymentPreferencesModule } from '@api/bff/payments/user-payment-preferences/payments-user-payment-preferences.module';
import { PaymentsWalletsModule } from '@api/payments/wallets/payments-wallets.module';
import { PersonalDataInformationModal } from '@private/features/chat/modals/personal-data-information-modal/personal-data-information-modal.component';
import { ScrollingMessageComponent } from '@private/features/chat/components/scrolling-message';
import { SharedModule } from '@shared/shared.module';
import { TranslateButtonModule } from '@core/components/translate-button/translate-button.module';
import { UserDetailComponent } from '@private/features/chat/components/user-detail';
import { UserResponseRateModule } from '@private/features/chat/components/user-response-rate/user-response-rate.module';

import { AutosizeModule } from 'ngx-autosize';
import { NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbModalModule,
    SharedModule,
    ChatRoutingModule,
    AutosizeModule,
    MessageModule,
    UserResponseRateModule,
    ItemAvatarModule,
    CustomCurrencyModule,
    NgxPermissionsModule.forChild(),
    TranslateButtonModule,
    ChatApiModule,
    DeliveryBannerModule,
    DeliveryBuyerModule,
    DeliveryBuyerCalculatorModule,
    DeliveryCostsModule,
    PaymentsCreditCardModule,
    PaymentsPaymentMethodsModule,
    PaymentsUserPaymentPreferencesModule,
    PaymentsWalletsModule,
    DeliveryConversationContextModule,
  ],
  declarations: [
    chatRoutedComponents,
    InputComponent,
    ConnectionAlertComponent,
    ItemReservedComponent,
    ItemSoldComponent,
    ArchiveInboxConversationComponent,
    UnarchiveInboxConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    UserDetailComponent,
    InboxComponent,
    InboxConversationComponent,
    ArchivedInboxConversationComponent,
    CurrentConversationComponent,
    InboxUserDetailComponent,
    InboxItemDetailComponent,
    InboxItemForSellComponent,
    ScrollingMessageComponent,
    ConversationDetailsBarComponent,
    MaliciousConversationModalComponent,
    PersonalDataInformationModal,
  ],
  providers: [ChatTranslationService, DeliveryConversationContextService, DeliveryAddressService, DeliveryAddressStoreService],
  exports: [InboxConversationComponent],
  entryComponents: [
    ArchiveInboxConversationComponent,
    UnarchiveInboxConversationComponent,
    ReportListingComponent,
    ReportUserComponent,
    BlockUserComponent,
    UnblockUserComponent,
    MaliciousConversationModalComponent,
    PersonalDataInformationModal,
  ],
})
export class ChatModule {}
