import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/index';
import { PaymentService } from '../payments/payment.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { EventService } from '../event/event.service';

@Injectable()
export class StripeService {

  public fullName: string;

  constructor(private paymentService: PaymentService,
              private userService: UserService,
              private router: Router,
              private eventService: EventService) {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user.firstName + ' ' + user.lastName;
    });
  }

  public buy(orderId: string, hasFinancialCard: boolean, cardType: string, card: any): void {
    if (!hasFinancialCard || hasFinancialCard && cardType === 'new') {
      this.paymentService.paymentIntent(orderId).subscribe((response: any) => {
        this.payment(response.token, card).then((response: any) => {
          this.handlePayment(response);
        });
      });
    } else {
      this.paymentService.paymentIntent(orderId).subscribe((response: any) => {
        this.payment(response.token, card).then((response: any) => {
          this.handlePayment(response);
        });
      }, () => {
        this.router.navigate(['catalog/list', { code: -1 }]);
      });
    }
  }

  handlePayment = (paymentResponse)  => {
    const { paymentIntent, error } = paymentResponse;

    if (error) {
      this.eventService.emit('paymentResponse', error);
    } else {
      this.eventService.emit('paymentResponse', paymentIntent.status);
    }
  };

  payment = async (token, card) => {
    return await stripe.handleCardPayment(
      token, card, {
        source_data: {
          owner: {name: this.fullName}
        }
      }
    );
  };
}