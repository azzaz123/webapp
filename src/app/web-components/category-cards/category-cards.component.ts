import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
import { APP_LOCALE } from '@configs/subdomains.config';
import 'wallapop-web-components/dist/category-cards/category-cards.dev.js';
import { AccessTokenService } from '@core/http/access-token.service';

@Component({
  selector: 'tsl-category-cards',
  templateUrl: './category-cards.component.html',
  styleUrls: ['./category-cards.component.scss'],
})
export class CategoryCardsComponent {
  @Input() categoryId: string;
  @Input() objectTypeId: string;

  public token: string;

  constructor(@Inject(LOCALE_ID) public locale: APP_LOCALE, private accessTokenService: AccessTokenService) {
    this.token = this.accessTokenService.accessToken;
  }
}
