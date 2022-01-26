import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptScreenComponent } from './accept-screen.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcceptScreenModalComponent } from './modals/accept-screen-modal/accept-screen-modal.component';
import { ActivatedRoute } from '@angular/router';

describe('AcceptScreenComponent', () => {
  const modalRef: any = {
    result: Promise.resolve(),
    componentInstance: {},
  };

  const MOCK_REQUEST_ID: string = 'j37eg37gd';
  let component: AcceptScreenComponent;
  let fixture: ComponentFixture<AcceptScreenComponent>;
  let modalService: NgbModal;

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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenComponent);
    modalService = TestBed.inject(NgbModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the Accept Screen inits...', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();

      fixture.detectChanges();
    });

    it('should open the accept screen modal', () => {
      expect(modalRef.componentInstance.requestId).toEqual(MOCK_REQUEST_ID);
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(AcceptScreenModalComponent);
    });
  });
});
