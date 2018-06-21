import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HelpService } from './help.service';
import { I18nService } from '../core/i18n/i18n.service';

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

  constructor(private i18n: I18nService,
              private helpService: HelpService,
              private router: Router) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment);
          if (element) {
            this.active = tree.fragment;
            element.scrollIntoView({block: 'start', inline: 'nearest', behavior: 'smooth'});
          }
        }
      }
    });
  }

  ngOnInit() {
    this.helpService.getFaqs(this.i18n.locale).subscribe((faqs: any[]) => {
      this.faqs = faqs;
    });
    this.helpService.getFeatures(this.i18n.locale).subscribe((features: any[]) => {
      this.features = features;
    });
  }

  public scrollTop() {
    const element = document.querySelector('#header');
    if (element) {
      this.active = '';
      element.scrollIntoView({block: 'start', inline: 'nearest', behavior: 'smooth'});
    }
  }

  public onPageScroll($event: Event) {
    if((<HTMLElement>$event.target).scrollTop >= 350) {
      this.showScrollTop = true;
    } else {
      this.showScrollTop = false;
    }
  }
}
