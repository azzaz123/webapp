import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CategoryResponse, SuggestedCategory } from './category-response.interface';
import { I18nService } from '../i18n/i18n.service';
import { environment } from '../../../environments/environment';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { APP_LOCALE } from 'configs/subdomains.config';

export const CATEGORIES_ENDPOINT = 'api/v3/categories/keys/';
export const SUGGESTED_CATEGORIES_ENDPOINT = 'api/v3/classifier/upload-blackbox';

@Injectable()
export class CategoryService {
  private categories: CategoryResponse[];
  private lang = this.locale === 'es' ? this.locale + '_ES' : this.locale;

  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private http: HttpClient, private i18n: I18nService) {}

  public getCategoryById(id: number): Observable<CategoryResponse> {
    return this.getCategories().pipe(map((categories) => categories.find((category) => category.category_id === id)));
  }

  public getCategories(): Observable<CategoryResponse[]> {
    if (this.categories) {
      return of(this.categories);
    }
    return this.http
      .get<CategoryResponse[]>(`${environment.baseUrl}${CATEGORIES_ENDPOINT}`, {
        params: { language: this.lang },
        headers: {
          Accept: 'application/vnd.categories-v2+json',
        },
      })
      .pipe(tap((categories) => (this.categories = categories)));
  }

  public getCategoryIconById(categoryId: number): Observable<string> {
    const iconPath = '/assets/icons/categories/stroke/';
    const defaultIcon = `${iconPath}All.svg`;

    return this.getCategories().pipe(
      map((categories) => {
        const categoryIcon = categories?.find((category) => category.category_id === categoryId)?.icon_id;
        return categoryIcon ? `${iconPath}${categoryIcon}.svg` : defaultIcon;
      }),
      catchError(() => of(defaultIcon))
    );
  }

  public getConsumerGoodsCategory(): CategoryResponse {
    return {
      category_id: 0,
      name: this.i18n.translate(TRANSLATION_KEY.CONSUMER_GOODS_GENERAL_CATEGORY_TITLE),
      icon_id: 'All',
      vertical_id: 'consumer_goods',
      fields: {},
    };
  }

  getSuggestedCategory(text: string): Observable<SuggestedCategory> {
    const params = new HttpParams().set('text', text);
    return this.http
      .get<SuggestedCategory[]>(`${environment.baseUrl}${SUGGESTED_CATEGORIES_ENDPOINT}`, { params })
      .pipe(map((response) => (response.length > 0 ? response[0] : null)));
  }
}
