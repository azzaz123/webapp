import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '@core/event/event.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { SearchBoxValue } from '@layout/topbar/core/interfaces/suggester-response.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WallacoinsDisabledModalComponent } from '@shared/modals/wallacoins-disabled-modal/wallacoins-disabled-modal.component';
import { APP_PATHS } from 'app/app-routing-constants';
import { PUBLIC_PATHS } from 'app/public/public-routing-constants';
import { CookieService } from 'ngx-cookie';
import { Subscription } from 'rxjs';
import { FeatureflagService } from '@core/user/featureflag.service';
import { Router } from '@angular/router';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SearchTrackingEventsService } from '@public/core/services/search-tracking-events/search-tracking-events.service';

@Component({
  selector: 'tsl-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  public readonly LOGIN_PATH = `${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.LOGIN}`;
  public user: User;
  public homeUrl: string;
  public isProfessional: boolean;
  public wallacoins: number = 0;
  public currencyName: string;
  public isLogged: boolean;

  @Input() isMyZone: boolean;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    public userService: UserService,
    public unreadChatMessagesService: UnreadChatMessagesService,
    private paymentService: PaymentService,
    private eventService: EventService,
    private cookieService: CookieService,
    private modalService: NgbModal,
    private searchTrackingEventsService: SearchTrackingEventsService,
    private featureFlagService: FeatureflagService,
    private router: Router,
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
      this.eventService.subscribe(EventService.TOTAL_CREDITS_UPDATED, (totalCredits: number) => {
        if (totalCredits) {
          this.wallacoins = totalCredits;
        } else {
          this.updateCreditInfo(false);
        }
      })
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
    this.paymentService.getCreditInfo(cache).subscribe((creditInfo: CreditInfo) => {
      this.currencyName = creditInfo.currencyName;
      this.wallacoins = creditInfo.credit;
      this.setCreditCookie();
    });
  }

  private setCreditCookie() {
    const cookieOptions = environment.name === 'local' ? { domain: 'localhost' } : { domain: '.wallapop.com' };
    this.cookieService.put('creditName', this.currencyName, cookieOptions);
    this.cookieService.put('creditQuantity', this.wallacoins.toString(), cookieOptions);
  }

  public onSearchSubmit(searchValue: SearchBoxValue): void {
    //TODO: This can be removed after tests
    const isExperimentalFeaturesEnabled = this.featureFlagService.isExperimentalFeaturesEnabled();
    this.trackSearchEvent(searchValue);
    /*
    if (isExperimentalFeaturesEnabled) {
      this.redirectToSearchPage(searchValue);
    } else {
      this.redirectToOldSearch(searchValue);
    } */
  }

  private redirectToSearchPage(searchParams: SearchBoxValue) {
    this.router.navigate([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.SEARCH}`], {
      queryParams: { ...searchParams },
    });
  }

  private redirectToOldSearch(searchParams: SearchBoxValue) {
    const oldSearchURL = new URL(`${this.homeUrl}search`);

    if (searchParams[FILTER_QUERY_PARAM_KEY.categoryId]) {
      oldSearchURL.searchParams.set(FILTER_QUERY_PARAM_KEY.categoryId, searchParams[FILTER_QUERY_PARAM_KEY.categoryId]);
    }
    oldSearchURL.searchParams.set(FILTER_QUERY_PARAM_KEY.keywords, searchParams[FILTER_QUERY_PARAM_KEY.keywords]);

    window.location.href = `${oldSearchURL}`;
  }

  public onOpenWallacoinsModal(): void {
    this.modalService.open(WallacoinsDisabledModalComponent, {
      windowClass: 'modal-standard',
      backdrop: 'static',
    });
  }

  private trackSearchEvent(searchValue): void {
    this.searchTrackingEventsService.topBarTrackSearchEvent(searchValue);
  }

  ngOnDestroy(): void {
    this.componentSubscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }
}
