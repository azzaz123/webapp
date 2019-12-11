import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBlockerComponent } from './mobile-blocker.component';
import { DeviceDetectorServiceMock } from '../../../tests';
import { UserService } from '../user/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';

describe('MobileBlockerComponent', () => {
  let component: MobileBlockerComponent;
  let fixture: ComponentFixture<MobileBlockerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileBlockerComponent ],
      providers: [
        { provide: UserService, useValue: { isProUser: () => of(false) }},
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileBlockerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
