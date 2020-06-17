import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { MobileBlockerComponent } from './mobile-blocker.component';
import { DeviceDetectorServiceMock } from '../../../tests';
import { UserService } from '../user/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { EventService } from '../event/event.service';

xdescribe('MobileBlockerComponent', () => {
  let injector: TestBed;
  let component: MobileBlockerComponent;
  let userService: UserService;
  let deviceDetectorService: DeviceDetectorService;
  let fixture: ComponentFixture<MobileBlockerComponent>;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileBlockerComponent ],
      providers: [
        EventService,
        { provide: UserService, useValue: { isProfessional: () => of(false) }},
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileBlockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    eventService = TestBed.get(EventService);
    injector = getTestBed();
    userService = injector.get(UserService);
    deviceDetectorService = injector.get(DeviceDetectorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user is using a mobile device', () => {

    beforeEach(() => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);
    });

    describe('and the user is a car dealer', () => {
      it('should show the mobile block component', () => {
        spyOn(userService, 'isProfessional').and.returnValue(of(true));

        component.ngOnInit();
        fixture.detectChanges();
  
        const componentHTML = fixture.debugElement.query(By.css('.MobileBlocker'));
        expect(componentHTML).toBeTruthy();
      });
    });
  
    describe('and the user is not a car dealer', () => {
      it('should not show mobile block component', () => {
        spyOn(userService, 'isProfessional').and.returnValue(of(false));

        component.ngOnInit();
        fixture.detectChanges();
  
        const componentHTML = fixture.debugElement.query(By.css('.MobileBlocker'));
        expect(componentHTML).toBeFalsy();
      });
    });
  });

  describe('when the user is not using a mobile device', () => {
    it('should not show mobile block component', () => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);

      component.ngOnInit();
      fixture.detectChanges();

      const componentHTML = fixture.debugElement.query(By.css('.MobileBlocker'));
      expect(componentHTML).toBeFalsy();
    });
  });

});
