import { BuyerRequest } from '@api/core/model/delivery/buyer-request/buyer-request.interface';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '@shared/web-view-modal/enums/web-view-modal-closure-method';
import { Observable } from 'rxjs';

export interface ContinuePaymentService {
  continue(request: BuyerRequest): Observable<WEB_VIEW_MODAL_CLOSURE_METHOD>;
}
