import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BumpTutorialComponent, KEY_CODE } from './bump-tutorial.component';
import { EventService } from "../../../core/event/event.service";
import { BumpTutorialService } from './bump-tutorial.service';

describe('BumpTutorialComponent', () => {
  let component: BumpTutorialComponent;
  let fixture: ComponentFixture<BumpTutorialComponent>;
  let tutorialService: BumpTutorialService;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BumpTutorialComponent ],
        providers: [
          {
            provide: BumpTutorialService, useValue: {
              nextStep() {
              },
              resetStep() {
              },
              prevStep() {
              }
            }
          },
          EventService
        ],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpTutorialComponent);
    component = fixture.componentInstance;
    tutorialService = TestBed.get(BumpTutorialService);
    eventService = TestBed.get(EventService);
  });

  describe('ngOnInit', () => {
    it('should call showBumpTutorial', () => {
      spyOn(component, 'showBumpTutorial');
      component.ngOnInit();
      eventService.emit(EventService.SHOW_BUMP_TUTORIAL);

      expect(component.showBumpTutorial).toHaveBeenCalled();
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

  describe('hideBumpTutorial', () => {
    it('should hide the tutorial', () => {
      component.hideBumpTutorial();

      expect(component.hidden).toBeTruthy();
    });
  });

  describe('showBumpTutorial', () => {
    it('should show the tutorial', () => {
      component.showBumpTutorial();

      expect(component.hidden).toBeFalsy();
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

    it('should call hideBumpTutorial if keyCode is Escape', () => {
      spyOn(component, 'hideBumpTutorial');
      const event = {
        keyCode: KEY_CODE.ESC
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(component.hideBumpTutorial).toHaveBeenCalled();
    });
  });

});
