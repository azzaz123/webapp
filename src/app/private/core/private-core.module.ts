import { NgModule } from '@angular/core';
import { ConversationModule } from '@core/conversation/conversation.module';
import { ProfileModule } from '@core/profile/profile.module';
import { ErrorsService } from '@core/errors/errors.service';
import { TutorialService } from '@core/tutorial/tutorial.service';
import { DesktopNotificationsService } from '@core/desktop-notifications/desktop-notifications.service';
import { XmppService } from '@core/xmpp/xmpp.service';
import { RealTimeService } from '@core/message/real-time.service';
import { InboxService } from '@private/features/chat/core/inbox/inbox.service';
import { BlockUserService } from '@private/features/chat/core/block-user/block-user.service';
import { BlockUserXmppService } from '@private/features/chat/core/block-user/block-user-xmpp.service';
import { ReviewService } from '@core/review/review.service';
import { ConnectionService } from '@core/connection/connection.service';
import { StripeService } from '@core/stripe/stripe.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { TrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.service';
import { CartService } from '@shared/catalog/cart/cart.service';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { InvoiceService } from '@core/invoice/invoice.service';
import { InboxConversationService } from '@private/features/chat/core/inbox/inbox-conversation.service';
import { RemoteConsoleModule } from '@core/remote-console';
import { UploaderService } from '@shared/uploader/uploader.service';
import { SubscriptionBenefitsService } from '@core/subscriptions/subscription-benefits/services/subscription-benefits.service';
import { DeliveryDevelopmentGuard } from '@private/features/delivery/guards/delivery-development.guard';
import { SubscriptionsHttpService } from '@core/subscriptions/http/subscriptions-http.service';
import { YouGuard } from '@private/features/you/guards/you.guard';
import { DeliveryRealTimeService } from './services/delivery-real-time/delivery-real-time.service';
import { EnableDeliveryGuard } from '@private/features/delivery/guards/enable-delivery.guard';
import { DeliveryExperimentalFeaturesService } from './services/delivery-experimental-features/delivery-experimental-features.service';

@NgModule({
  imports: [ConversationModule.forRoot(), ProfileModule, RemoteConsoleModule],
  providers: [
    ErrorsService,
    TutorialService,
    DesktopNotificationsService,
    XmppService,
    RealTimeService,
    DeliveryRealTimeService,
    InboxService,
    BlockUserService,
    BlockUserXmppService,
    ReviewService,
    ConnectionService,
    StripeService,
    SubscriptionsService,
    SubscriptionsHttpService,
    SubscriptionBenefitsService,
    TrustAndSafetyService,
    InvoiceService,
    CartService,
    ExitConfirmGuard,
    InboxConversationService,
    UploaderService,
    DeliveryDevelopmentGuard,
    DeliveryExperimentalFeaturesService,
    EnableDeliveryGuard,
    YouGuard,
  ],
})
export class PrivateCoreModule {}
