import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CategoryDto } from '../dtos';
import { ACCEPT_HEADERS, HEADER_NAMES } from '@public/core/constants/header-constants';
import { CATEGORIES_ENDPOINT } from './endpoints';

@Injectable()
export class CategoriesHttpService {
  public constructor(private httpClient: HttpClient) {}

  public getCategories(context: 'search' | 'upload' = 'search'): Observable<CategoryDto[]> {
    return this.httpClient.get<CategoryDto[]>(CATEGORIES_ENDPOINT, {
      headers: {
        [HEADER_NAMES.ACCEPT]: ACCEPT_HEADERS.CATEGORIES_V2,
      },
      params: {
        context,
      },
    });
  }
}
