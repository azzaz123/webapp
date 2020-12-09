import { Component } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { FOOTER_LINKS } from './constants/footer-constants';
import { FooterLinkSection } from './interfaces/footer-link-section.interface';

@Component({
  selector: 'tsl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public currentYear = new Date().getFullYear();
  public readonly FOOTER_LINKS: FooterLinkSection[] = FOOTER_LINKS;

  constructor(private i18nService: I18nService) {
    this.FOOTER_LINKS = FOOTER_LINKS.filter(
      (footerLinkSection: FooterLinkSection) => {
        return !(footerLinkSection.excludedLanguages || []).includes(
          this.i18nService.locale
        );
      }
    );
  }
}
