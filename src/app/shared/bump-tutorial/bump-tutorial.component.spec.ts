import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BumpTutorialComponent, KEY_CODE } from './bump-tutorial.component';
import { BumpTutorialService } from './services/bump-tutorial.service';

describe('BumpTutorialComponent', () => {
  let component: BumpTutorialComponent;
  let fixture: ComponentFixture<BumpTutorialComponent>;
  let tutorialService: BumpTutorialService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BumpTutorialComponent],
        providers: [
          {
            provide: BumpTutorialService,
            useValue: {
              nextStep() {},
              resetStep() {},
              prevStep() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpTutorialComponent);
    component = fixture.componentInstance;
    tutorialService = TestBed.inject(BumpTutorialService);
  });

  describe('ngOnDestroy', () => {
    it('should call resetStep', () => {
      spyOn(tutorialService, 'resetStep');

      component.ngOnDestroy();

      expect(tutorialService.resetStep).toHaveBeenCalled();
    });
  });

  describe('hide', () => {
    it('should hide the tutorial and reset steps', () => {
      spyOn(tutorialService, 'resetStep');

      component.hide();

      expect(component.hidden).toBeTruthy();
      expect(tutorialService.resetStep).toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should show the tutorial', () => {
      component.show();

      expect(component.hidden).toBeFalsy();
    });
  });

  describe('keyEvent', () => {
    it('should call nextStep if keyCode is Right Arrow', () => {
      spyOn(tutorialService, 'nextStep');
      const event = {
        keyCode: KEY_CODE.RIGHT_ARROW,
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(tutorialService.nextStep).toHaveBeenCalled();
    });

    it('should call prevStep if keyCode is Left Arrow', () => {
      spyOn(tutorialService, 'prevStep');
      const event = {
        keyCode: KEY_CODE.LEFT_ARROW,
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(tutorialService.prevStep).toHaveBeenCalled();
    });

    it('should call hide if keyCode is Escape', () => {
      spyOn(component, 'hide');
      const event = {
        keyCode: KEY_CODE.ESC,
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(component.hide).toHaveBeenCalled();
    });
  });
});
