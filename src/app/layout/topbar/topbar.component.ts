import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../core/user/user.service';
import { environment } from '../../../environments/environment';
import { Coordinate } from '../../core/geolocation/address-response.interface';
import { SuggesterResponse } from './suggester/suggester-response.interface';
import { User } from '../../core/user/user';
import { MessageService } from '../../chat/service/message.service';
import { PaymentService } from '../../core/payments/payment.service';
import { CreditInfo } from '../../core/payments/payment.interface';
import { EventService } from '../../core/event/event.service';
import { CookieService } from 'ngx-cookie';
import { Subscription } from 'rxjs';
import { APP_PATHS } from 'app/app-routing-constants';
import { PUBLIC_PATHS } from 'app/public/public-routing-constants';

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  public readonly LOGIN_PATH = `${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.LOGIN}`;
  public user: User;
  public coordinates: Coordinate;
  public category: number;
  public kws: string;
  public focus: boolean;
  public homeUrl: string;
  public model: any;
  @Input() isMyZone: boolean;
  @ViewChild('categoryEl') categoryEl: ElementRef;
  @ViewChild('kwsEl') kwsEl: ElementRef;
  public isProfessional: boolean;
  public wallacoins: number = 0;
  public currencyName: string;
  public isLogged: boolean;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    public userService: UserService,
    public messageService: MessageService,
    private paymentService: PaymentService,
    private eventService: EventService,
    private cookieService: CookieService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {
    this.homeUrl = environment.siteUrl.replace('es', this.subdomain);
  }

  ngOnInit() {
    this.isLogged = this.userService.isLogged;
    this.componentSubscriptions.push(
      this.userService.me().subscribe((user) => {
        this.user = user;
      })
    );
    this.componentSubscriptions.push(
      this.userService.isProfessional().subscribe((value: boolean) => {
        this.isProfessional = value;
      })
    );
    this.updateCreditInfo();
    this.componentSubscriptions.push(
      this.eventService.subscribe(
        EventService.TOTAL_CREDITS_UPDATED,
        (totalCredits: number) => {
          if (totalCredits) {
            this.wallacoins = totalCredits;
          } else {
            this.updateCreditInfo(false);
          }
        }
      )
    );
    this.componentSubscriptions.push(
      this.eventService.subscribe(EventService.USER_LOGIN, () => {
        this.isLogged = this.userService.isLogged;
      })
    );

    this.componentSubscriptions.push(
      this.eventService.subscribe(EventService.USER_LOGOUT, () => {
        this.isLogged = this.userService.isLogged;
      })
    );
  }

  private updateCreditInfo(cache?: boolean) {
    this.paymentService
      .getCreditInfo(cache)
      .subscribe((creditInfo: CreditInfo) => {
        this.currencyName = creditInfo.currencyName;
        this.wallacoins = creditInfo.credit;
        this.setCreditCookie();
      });
  }

  private setCreditCookie() {
    const cookieOptions =
      environment.name === 'local'
        ? { domain: 'localhost' }
        : { domain: '.wallapop.com' };
    this.cookieService.put('creditName', this.currencyName, cookieOptions);
    this.cookieService.put(
      'creditQuantity',
      this.wallacoins.toString(),
      cookieOptions
    );
  }

  public submitForm() {
    const categoryId = this.category ? this.category : '';
    const kws = this.kws ? this.kws : '';
    window.location.href = `${this.homeUrl}search?category_ids=${categoryId}&keywords=${kws}`;
  }

  public onSearchSubmit(newSearchSubmit: string) {
    this.kws = newSearchSubmit;
    this.submitForm();
  }

  public onSearchUpdate(newSearch: SuggesterResponse) {
    this.kws = newSearch.suggestion;
    this.category = newSearch.category_id;
    this.submitForm();
  }

  public onKeywordUpdate(newKeyword: string) {
    this.kws = newKeyword;
  }

  ngOnDestroy(): void {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
