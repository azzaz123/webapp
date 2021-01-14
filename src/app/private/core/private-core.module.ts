import { NgModule } from '@angular/core';
import { CheckUserPermissionsResolver } from './resolvers/check-user-permissions.resolver';
import { ConversationModule } from '@core/conversation/conversation.module';
import { ProfileModule } from '@core/profile/profile.module';
import { ErrorsService } from '@core/errors/errors.service';
import { TutorialService } from '@core/tutorial/tutorial.service';
import { DesktopNotificationsService } from '@core/desktop-notifications/desktop-notifications.service';
import { XmppService } from '@core/xmpp/xmpp.service';
import { RealTimeService } from '@core/message/real-time.service';
import { InboxService } from '@features/chat/core/inbox/inbox.service';
import { BlockUserService } from '@features/chat/core/block-user/block-user.service';
import { BlockUserXmppService } from '@features/chat/core/block-user/block-user-xmpp.service';
import { ReviewService } from '@core/review/review.service';
import { ConnectionService } from '@core/connection/connection.service';
import { StripeService } from '@core/stripe/stripe.service';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { TrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.service';
import { CategoryService } from '@core/category/category.service';
import { CartService } from '@shared/catalog/cart/cart.service';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { InvoiceService } from '@core/invoice/invoice.service';

@NgModule({
  imports: [ConversationModule.forRoot(), ProfileModule],
  providers: [
    CheckUserPermissionsResolver,
    ErrorsService,
    TutorialService,
    DesktopNotificationsService,
    XmppService,
    RealTimeService,
    InboxService,
    BlockUserService,
    BlockUserXmppService,
    ReviewService,
    ConnectionService,
    StripeService,
    SubscriptionsService,
    TrustAndSafetyService,
    InvoiceService,
    CategoryService,
    CartService,
    ExitConfirmGuard,
  ],
})
export class PrivateCoreModule {}
