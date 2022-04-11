import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, ReplaySubject } from 'rxjs';
import { WebViewModalComponent } from '../components/web-view-modal.component';
import { WEB_VIEW_MODAL_CLOSURE_METHOD } from '../enums/web-view-modal-closure-method';

import { WebViewModalService } from './web-view-modal.service';

describe('WebViewModalService', () => {
  let service: WebViewModalService;
  let modalService: NgbModal;

  const MOCK_CLOSE_CALLBACK = () => {};
  const MOCK_MODAL_CLOSE_SUBJECT: ReplaySubject<WEB_VIEW_MODAL_CLOSURE_METHOD> = new ReplaySubject<WEB_VIEW_MODAL_CLOSURE_METHOD>();
  const MOCK_MODAL_REF: Partial<NgbModalRef> = {
    componentInstance: {},
    close: MOCK_CLOSE_CALLBACK,
    result: MOCK_MODAL_CLOSE_SUBJECT.asObservable().toPromise(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebViewModalService, { provide: NgbModal, useValue: { open: () => MOCK_MODAL_REF } }],
    });
    service = TestBed.inject(WebViewModalService);
    modalService = TestBed.inject(NgbModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking to open a web view modal', () => {
    const MOCK_URL = 'http://localhost:4200/lul';
    const MOCK_TITLE = 'La Web Existe';
    const MOCK_MODAL_CLASSNAME = 'webrulez';

    let result: Observable<WEB_VIEW_MODAL_CLOSURE_METHOD>;

    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();

      result = service.open(MOCK_URL, MOCK_TITLE, MOCK_MODAL_CLASSNAME);
    });

    it('should open a modal with the web view component and valid configuration', () => {
      expect(modalService.open).toHaveBeenCalledWith(WebViewModalComponent, {
        backdrop: 'static',
        windowClass: MOCK_MODAL_CLASSNAME,
        keyboard: false,
      });
    });

    it('should set the web view modal component with valid URL', () => {
      expect(MOCK_MODAL_REF.componentInstance.startUrl).toEqual(MOCK_URL);
    });

    it('should set valid title', () => {
      expect(MOCK_MODAL_REF.componentInstance.title).toEqual(MOCK_TITLE);
    });

    it('should pass the logic to close the modal within itself', () => {
      const stringifiedCallbackInComponent: string = JSON.stringify(MOCK_MODAL_REF.componentInstance.closeCallback);
      const stringifiedCallbackExpected: string = JSON.stringify(MOCK_CLOSE_CALLBACK.bind(MOCK_MODAL_REF));

      expect(stringifiedCallbackInComponent).toEqual(stringifiedCallbackExpected);
    });

    describe('and when the modal closes', () => {
      const MOCK_CLOSURE_METHOD: WEB_VIEW_MODAL_CLOSURE_METHOD = WEB_VIEW_MODAL_CLOSURE_METHOD.MANUAL;

      beforeEach(() => {
        MOCK_MODAL_CLOSE_SUBJECT.next(MOCK_CLOSURE_METHOD);
        MOCK_MODAL_CLOSE_SUBJECT.complete();
      });

      it('should get the closure method', fakeAsync(() => {
        let modalClosureResult: WEB_VIEW_MODAL_CLOSURE_METHOD;

        result.subscribe((closure) => (modalClosureResult = closure));
        tick();

        expect(modalClosureResult).toEqual(MOCK_CLOSURE_METHOD);
      }));
    });
  });
});
