import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { finalize, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {
  SELLBYTEL_PHONE,
  CARDEALER_COMMERCIAL_CONTACT_MAIL,
} from 'app/core/constants';
import { I18nService } from 'app/core/i18n/i18n.service';
import { HelpService } from '../help.service';

@Component({
  selector: 'tsl-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit, OnDestroy {
  public features: any[];
  public faqs: any[];
  public active: string;
  public showScrollTop: boolean;
  public scrollTop: number;
  public sellbytelPhone = SELLBYTEL_PHONE;
  public cardealerCommercialContactMail = CARDEALER_COMMERCIAL_CONTACT_MAIL;
  private routeFragmentsSubscription: Subscription;

  constructor(
    private i18n: I18nService,
    private helpService: HelpService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.helpService
      .getFaqs(this.i18n.locale)
      .pipe(take(1))
      .subscribe((faqs: any[]) => {
        this.faqs = faqs;
      });
    this.helpService
      .getFeatures(this.i18n.locale)
      .pipe(
        take(1),
        finalize(() => this.subscribeToRouteAnchors())
      )
      .subscribe((features: any[]) => {
        this.features = features;
      });
  }

  ngOnDestroy() {
    if (!!this.routeFragmentsSubscription) {
      this.routeFragmentsSubscription.unsubscribe();
    }
  }

  public onPageScroll($event: Event) {
    if ((<HTMLElement>$event.target).scrollTop >= 350) {
      this.showScrollTop = true;
    } else {
      this.showScrollTop = false;
    }
  }

  public scrollToTop() {
    this.scrollToElement('header');
  }

  private scrollToElement(fragment: string) {
    const element: HTMLElement = this.document.querySelector('#' + fragment);
    if (element) {
      element.scrollIntoView({ block: 'center' });
    }
  }

  private subscribeToRouteAnchors(): void {
    this.routeFragmentsSubscription = this.route.fragment.subscribe(
      (fragment: string) => {
        this.scrollToElement(fragment);
      }
    );
  }
}
