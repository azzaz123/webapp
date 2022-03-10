import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptScreenComponent } from './accept-screen.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DELIVERY_MODAL_CLASSNAME } from '../delivery/constants/delivery-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { STREAMLINE_PATHS } from '../delivery/pages/streamline/streamline.routing.constants';
import { DELIVERY_PATHS } from '../delivery/delivery-routing-constants';

describe('AcceptScreenComponent', () => {
  const TTS_MOCK_LINK: string = '/delivery/tracking/sdb';
  const ONGOING_SELLS_LINK: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.SELLS}/${STREAMLINE_PATHS.ONGOING}`;
  const modalRef: Partial<NgbModalRef> = {
    result: Promise.resolve(),
    componentInstance: {},
  };

  const MOCK_REQUEST_ID: string = 'j37eg37gd';
  let component: AcceptScreenComponent;
  let fixture: ComponentFixture<AcceptScreenComponent>;
  let modalService: NgbModal;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptScreenComponent],
      providers: [
        {
          provide: NgbModal,
          useValue: {
            open() {
              return modalRef;
            },
            dismissAll() {},
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => MOCK_REQUEST_ID,
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
            get url() {
              return '';
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenComponent);
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the Accept Screen inits...', () => {
    beforeEach(() => {
      spyOn(router, 'navigate');
    });

    it('should open the accept screen modal', () => {
      spyOn(modalService, 'open').and.callThrough();

      fixture.detectChanges();

      expect(modalRef.componentInstance.requestId).toEqual(MOCK_REQUEST_ID);
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(AcceptScreenModalComponent, {
        windowClass: DELIVERY_MODAL_CLASSNAME,
        backdrop: 'static',
      });
    });

    describe('and we close the modal accepting the request...', () => {
      describe('and we are redirecting to the TTS', () => {
        beforeEach(() => {
          spyOn(modalService, 'open').and.callThrough();
          jest.spyOn(router, 'url', 'get').mockReturnValue(TTS_MOCK_LINK);

          fixture.detectChanges();
        });

        it('should NOT redirect to the ongoing sells page', () => {
          expect(router.navigate).not.toHaveBeenCalled();
        });
      });
    });

    describe('and we are NOT redirecting to the TTS', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.callThrough();

        fixture.detectChanges();
      });

      it('should redirect to the ongoing sells page', () => {
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([ONGOING_SELLS_LINK]);
      });
    });

    describe('and we close the modal rejecting the request', () => {
      describe('and we are redirecting to the TTS', () => {
        beforeEach(() => {
          jest.spyOn(router, 'url', 'get').mockReturnValue(TTS_MOCK_LINK);
          spyOn(modalService, 'open').and.returnValue({
            result: Promise.reject(),
            componentInstance: {},
          });

          fixture.detectChanges();
        });

        it('should NOT redirect to the ongoing sells page', () => {
          expect(router.navigate).not.toHaveBeenCalled();
        });
      });

      describe('and we are NOT redirecting to the TTS', () => {
        beforeEach(() => {
          spyOn(modalService, 'open').and.returnValue({
            result: Promise.reject(),
            componentInstance: {},
          });

          fixture.detectChanges();
        });
        it('should redirect to the ongoing sells page', () => {
          expect(router.navigate).toHaveBeenCalledTimes(1);
          expect(router.navigate).toHaveBeenCalledWith([ONGOING_SELLS_LINK]);
        });
      });
    });
  });

  describe('when we leave the accept screen', () => {
    beforeEach(() => {
      spyOn(modalService, 'dismissAll');
      component.ngOnDestroy();
    });

    it('should close the modal', () => {
      expect(modalService.dismissAll).toHaveBeenCalledTimes(1);
    });
  });
});
