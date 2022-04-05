import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { RecommendedItemsBodyResponse } from './interfaces/recommender-response.interface';

export const RECOMMENDATIONS_API_URL = (itemId: string) => `${environment.baseUrl}api/v3/recommendations/${itemId}`;
export const GET_RECOMMENDATIONS_ENDPOINT = (id: string) => `${RECOMMENDATIONS_API_URL(id)}`;

@Injectable()
export class RecommendationsApiService {
  constructor(private http: HttpClient) {}

  public getRecommendedItemsByItemId(id: string): Observable<RecommendedItemsBodyResponse> {
    return this.http.get<RecommendedItemsBodyResponse>(GET_RECOMMENDATIONS_ENDPOINT(id));
  }
}
