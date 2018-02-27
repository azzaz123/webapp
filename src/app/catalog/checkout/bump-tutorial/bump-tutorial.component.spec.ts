import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BumpTutorialComponent, KEY_CODE } from './bump-tutorial.component';
import { BumpTutorialService } from './bump-tutorial.service';
import { Observable } from 'rxjs/Observable';

describe('BumpTutorialComponent', () => {
  let component: BumpTutorialComponent;
  let fixture: ComponentFixture<BumpTutorialComponent>;
  let bumpTutorialService: BumpTutorialService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BumpTutorialComponent ],
        providers: [
          {
            provide: BumpTutorialService, useValue: {
              setDisplayed() {
              },
              nextStep() {
              },
              resetStep() {
              },
              prevStep() {
              },
              isAlreadyDisplayed() {
                return Observable.of(false);
              }
            }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpTutorialComponent);
    component = fixture.componentInstance;
    bumpTutorialService = TestBed.get(BumpTutorialService);
  });

  describe('ngOnInit', () => {
    it('should call setDisplayed', () => {
      spyOn(bumpTutorialService, 'setDisplayed');

      fixture.detectChanges();

      expect(bumpTutorialService.setDisplayed).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call resetStep', () => {
      spyOn(bumpTutorialService, 'resetStep');

      component.ngOnDestroy();

      expect(bumpTutorialService.resetStep).toHaveBeenCalled();
    });
  });

  describe('nextStep', () => {
    it('should call nextStep', () => {
      spyOn(bumpTutorialService, 'nextStep');

      component.nextStep();

      expect(bumpTutorialService.nextStep).toHaveBeenCalled();
    });
  });

  describe('hideBumpTutorial', () => {
    it('should hide the tutorial', () => {
      component.hideBumpTutorial();

      expect(component.hidden).toBeTruthy();
    });
  });

  describe('showBumpTutorial', () => {

    let displayed: boolean;

    beforeEach(() => {
      displayed = undefined;
    });

    it('should show the tutorial if it has not been displayed', () => {
      (<Observable<boolean>>component.showBumpTutorial()).subscribe((val: boolean) => {
        displayed = val;
      });

      expect(displayed).toBeFalsy();
    });

    it('should not show the tutorial if it has already been displayed', () => {
      spyOn(bumpTutorialService, 'isAlreadyDisplayed').and.returnValue(Observable.of(true));

      (<Observable<boolean>>component.showBumpTutorial()).subscribe((val: boolean) => {
        displayed = val;
      });

      expect(displayed).toBeTruthy();
    });
  });

  describe('keyEvent', () => {
    it('should call nextStep if keyCode is Right Arrow', () => {
      spyOn(bumpTutorialService, 'nextStep');
      const event = {
        keyCode: KEY_CODE.RIGHT_ARROW
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(bumpTutorialService.nextStep).toHaveBeenCalled();
    });

    it('should call prevStep if keyCode is Left Arrow', () => {
      spyOn(bumpTutorialService, 'prevStep');
      const event = {
        keyCode: KEY_CODE.LEFT_ARROW
      };

      component.keyEvent(<KeyboardEvent>event);

      expect(bumpTutorialService.prevStep).toHaveBeenCalled();
    });
  });

});
