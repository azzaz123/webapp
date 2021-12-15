import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { DELIVERY_PATHS } from '../delivery-routing-constants';
import { TRXAwarenessModalComponent } from '../modals/trx-awareness-modal/trx-awareness-modal.component';

import { DeliveryComponent, LOCAL_STORAGE_TRX_AWARENESS } from './delivery.component';

describe('DeliveryComponent', () => {
  const FAKE_DATE_NOW = 1627743615459;
  const URL = `/${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.STREAMLINE}`;
  let component: DeliveryComponent;
  let fixture: ComponentFixture<DeliveryComponent>;
  let router: Router;
  let userService: UserService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, NgbModalModule],
      declarations: [DeliveryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: UserService,
          useValue: {
            getLocalStore() {},
            saveLocalStore() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    modalService = TestBed.inject(NgbModal);

    fixture.detectChanges();

    spyOn(Date, 'now').and.returnValue(FAKE_DATE_NOW);
    spyOn(userService, 'saveLocalStore');
    spyOn(modalService, 'open').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user navigates through the nav links...', () => {
    it('should navigate to the specified URL', () => {
      const navLinksElement = fixture.debugElement.query(By.css('tsl-nav-links'));
      spyOn(router, 'navigate');

      navLinksElement.triggerEventHandler('clickedLink', URL);

      expect(router.navigate).toHaveBeenCalledWith([URL]);
    });
  });

  describe('when we click the help button', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css('a')).nativeElement.click();
    });

    it('should open the TRX Awareness Modal', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
    });

    it('should NOT save the user view in the local store', () => {
      expect(userService.saveLocalStore).not.toHaveBeenCalled();
    });
  });

  describe('when the user has not previously viewed the TRX Awareness Modal', () => {
    beforeEach(() => {
      spyOn(userService, 'getLocalStore').and.returnValue(false);

      component.ngOnInit();
    });

    it('should open the TRX Awareness Modal', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
    });

    it('should save the user view in the local store', () => {
      expect(userService.saveLocalStore).toHaveBeenCalledTimes(1);
      expect(userService.saveLocalStore).toHaveBeenCalledWith(LOCAL_STORAGE_TRX_AWARENESS, FAKE_DATE_NOW.toString());
    });
  });

  describe('wwhen the user has previously viewed the TRX Awareness Modal', () => {
    beforeEach(() => {
      spyOn(userService, 'getLocalStore').and.returnValue(true);

      component.ngOnInit();
    });

    it('should NOT open the TRX Awareness Modal', () => {
      expect(modalService.open).not.toHaveBeenCalled();
    });

    it('should NOT save the user view in the local store', () => {
      expect(userService.saveLocalStore).not.toHaveBeenCalled();
    });
  });
});
