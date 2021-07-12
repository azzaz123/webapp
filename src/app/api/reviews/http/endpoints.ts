import { environment } from '@environments/environment';

export const USER_REVIEWS_ENDPOINT = (id: string) => `${environment.baseUrl}api/v3/users/${id}/reviews`;
export const REVIEW_TRANSLATION_ENDPOINT = (id: string) => `${environment.baseUrl}api/v3/reviews/${id}/translation`;
