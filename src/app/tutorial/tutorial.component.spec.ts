import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KEY_CODE, TutorialComponent } from './tutorial.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TutorialService } from '../core/tutorial/tutorial.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserService } from '../core/user/user.service';
import { Observable } from 'rxjs';

describe('TutorialComponent', () => {
  let component: TutorialComponent;
  let fixture: ComponentFixture<TutorialComponent>;
  let tutorialService: TutorialService;
  let router: Router;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, NgxPermissionsModule.forRoot()],
      declarations: [TutorialComponent],
      providers: [
        {
          provide: TutorialService, useValue: {
          setDisplayed() {
          },
          nextStep() {
          },
          resetStep() {
          },
          prevStep() {
          }
        }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
        }
        },
        {
          provide: UserService, useValue: {
          hasPerm() {
            return Observable.of(true);
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialComponent);
    component = fixture.componentInstance;
    tutorialService = TestBed.get(TutorialService);
    router = TestBed.get(Router);
    userService = TestBed.get(UserService);
  });

  describe('ngOnInit', () => {
    it('should call setDisplayed', () => {
      spyOn(tutorialService, 'setDisplayed');

      fixture.detectChanges();

      expect(tutorialService.setDisplayed).toHaveBeenCalled();
    });

    it('should call hasPerm and set the attribute', () => {
      spyOn(userService, 'hasPerm').and.callThrough();

      component.ngOnInit();

      expect(userService.hasPerm).toHaveBeenCalledWith('coins');
      expect(component.withCoins).toBe(true);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call resetStep', () => {
      spyOn(tutorialService, 'resetStep');

      component.ngOnDestroy();

      expect(tutorialService.resetStep).toHaveBeenCalled();
    });
  });

  describe('keyEvent', () => {
    it('should call nextStep if keyCode is Right Arrow', () => {
      spyOn(tutorialService, 'nextStep');
      const event = {
        keyCode: KEY_CODE.RIGHT_ARROW
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(tutorialService.nextStep).toHaveBeenCalled();
    });

    it('should call prevStep if keyCode is Left Arrow', () => {
      spyOn(tutorialService, 'prevStep');
      const event = {
        keyCode: KEY_CODE.LEFT_ARROW
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(tutorialService.prevStep).toHaveBeenCalled();
    });

    it('should redirect if keyCode is Esc', () => {
      spyOn(router, 'navigate');
      const event = {
        keyCode: KEY_CODE.ESC
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(router.navigate).toHaveBeenCalledWith(['/catalog/list']);
    });
  });


});
