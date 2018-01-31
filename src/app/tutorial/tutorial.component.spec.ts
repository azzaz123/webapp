import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialComponent } from './tutorial.component';
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
      declarations: [ TutorialComponent ],
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


});
