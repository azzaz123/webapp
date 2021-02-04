import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { RecommendedItemsBodyResponse } from './interfaces/recommender-response.interface';

export const RECOMMENDER_API_URL = (userId: string) => `${environment.baseUrl}api/v3/recommender/${userId}`;
export const GET_RECOMMENDATIONS_ENDPOINT = (id: string) => `${RECOMMENDER_API_URL(id)}`;

@Injectable()
export class RecommenderApiService {
  constructor(private http: HttpClient) {}

  public getRecommendedItemsByItemId(id: string): Observable<RecommendedItemsBodyResponse> {
    return this.http.get<RecommendedItemsBodyResponse>(GET_RECOMMENDATIONS_ENDPOINT(id));
  }
}
