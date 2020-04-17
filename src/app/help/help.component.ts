import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpService } from './help.service';
import { I18nService } from '../core/i18n/i18n.service';
import { DOCUMENT } from '@angular/common';
import { SELLBYTEL_PHONE, CARDEALER_COMMERCIAL_CONTACT_MAIL } from '../core/constants';

@Component({
  selector: 'tsl-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  public features: any[];
  public faqs: any[];
  public active: string;
  public showScrollTop: boolean;
  public scrollTop: number;
  public sellbytelPhone = SELLBYTEL_PHONE;
  public cardealerCommercialContactMail = CARDEALER_COMMERCIAL_CONTACT_MAIL;

  constructor(private i18n: I18nService,
              private helpService: HelpService,
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {
    this.helpService.getFaqs(this.i18n.locale).subscribe((faqs: any[]) => {
      this.faqs = faqs;
    });
    this.helpService.getFeatures(this.i18n.locale).subscribe((features: any[]) => {
      this.features = features;
    });
    setTimeout(() => {
      this.route.params.subscribe((params: any) => {
        if (params.section) {
          this.scrollToElement(params.section);
        }
      });
    });
  }

  public scrollToElement(fragment: string) {
    const element: HTMLElement = this.document.querySelector('#' + fragment);
    if (element) {
      this.scrollTop = element.offsetTop - element.offsetHeight + 150;
    }
  }

  public scrollToTop() {
    this.scrollTop = 0;
  }

  public onPageScroll($event: Event) {
    if((<HTMLElement>$event.target).scrollTop >= 350) {
      this.showScrollTop = true;
    } else {
      this.showScrollTop = false;
    }
  }
}
