import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProBadgeComponent } from './pro-badge.component';
import { UserService } from '../../core/user/user.service';
import { By } from '@angular/platform-browser';

describe('ProBadgeComponent', () => {
  let injector: TestBed;
  let fixture: ComponentFixture<ProBadgeComponent>;
  let component: ProBadgeComponent;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ],
      providers: [{
        provide: UserService, useValue: {
          isPro: false
        } 
      }],
      declarations: [ ProBadgeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    injector = getTestBed();
    userService = injector.get(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user is not PRO', () => {
    it('should hide the PRO badge', () => {
      const proBadgeHTML = fixture.debugElement.query(By.css('.ProBadge')).nativeNode;
      expect(proBadgeHTML.hasAttribute('hidden')).toBe(true);
    });
  });
  
  describe('when user is PRO', () => {
    it('should show the PRO badge', () => {
      spyOn(userService, 'isPro').and.returnValue(true);
      fixture.detectChanges();

      const proBadgeHTML = fixture.debugElement.query(By.css('.ProBadge')).nativeNode;
      expect(proBadgeHTML.hasAttribute('hidden')).toBe(false);
    });
  });
});
