import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KEY_CODE, TutorialComponent } from './tutorial.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TutorialService } from '../core/tutorial/tutorial.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TutorialComponent', () => {
  let component: TutorialComponent;
  let fixture: ComponentFixture<TutorialComponent>;
  let tutorialService: TutorialService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [TutorialComponent],
      providers: [
        {
          provide: TutorialService, useValue: {
          setDisplayed() {
          },
          nextStep() {
          },
          resetStep() {
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
  });

  describe('ngOnInit', () => {
    it('should call setDisplayed', () => {
      spyOn(tutorialService, 'setDisplayed');

      fixture.detectChanges();

      expect(tutorialService.setDisplayed).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call resetStep', () => {
      spyOn(tutorialService, 'resetStep');

      component.ngOnDestroy();

      expect(tutorialService.resetStep).toHaveBeenCalled();
    });
  });

  describe('nextStep', () => {
    it('should call nextStep', () => {
      spyOn(tutorialService, 'nextStep');

      component.nextStep();

      expect(tutorialService.nextStep).toHaveBeenCalled();
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
  });


});
