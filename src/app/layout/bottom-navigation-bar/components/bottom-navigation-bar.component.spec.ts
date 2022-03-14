import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SvgIconStubComponent } from '@fixtures/shared/components/svg-icon.component.stub';
import { BehaviorSubject, of } from 'rxjs';
import { BOTTOM_NAVIGATION_BAR_ELEMENTS, BOTTOM_NAVIGATION_BAR_ELEMENTS_COLLECTION } from '../constants/bottom-navigation-bar-elements';
import { BottomNavigationBarElement } from '../interfaces/bottom-navigation-bar-element.interface';
import { BottomNavigationBarService } from '../services/bottom-navigation-bar.service';

import { BottomNavigationBarComponent, ELEMENT_TYPE, INPUT_TYPE } from './bottom-navigation-bar.component';

describe('BottomNavigationBarComponent', () => {
  const MOCK_NAVIGATION_ELEMENTS = Object.values(BOTTOM_NAVIGATION_BAR_ELEMENTS_COLLECTION);

  let component: BottomNavigationBarComponent;
  let fixture: ComponentFixture<BottomNavigationBarComponent>;
  let bottomNavigationBarService: BottomNavigationBarService;
  let hiddenSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  let navigationElementsSubject: BehaviorSubject<BottomNavigationBarElement[]> = new BehaviorSubject(MOCK_NAVIGATION_ELEMENTS);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BottomNavigationBarComponent, SvgIconStubComponent],
      providers: [
        {
          provide: BottomNavigationBarService,
          useValue: {
            navigationElements$: navigationElementsSubject.asObservable(),
            hidden$: hiddenSubject.asObservable(),
            showNavigationBar() {},
            hideNavigationBar() {},
          },
        },
      ],
    })
      //https://github.com/angular/angular/issues/12313#issuecomment-298697327
      .overrideComponent(BottomNavigationBarComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomNavigationBarComponent);
    bottomNavigationBarService = TestBed.inject(BottomNavigationBarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the navigation bar is hidden', () => {
    it('should not be visible in the screen', () => {
      hiddenSubject.next(true);

      fixture.detectChanges();
      const navigationBarElement = fixture.debugElement.query(By.css('.BottomNavigationBar')).nativeElement;

      expect(navigationBarElement.hasAttribute('hidden')).toBe(true);
    });
  });

  describe('when the navigation bar is visible', () => {
    it('should be visible in the screen', () => {
      hiddenSubject.next(false);

      fixture.detectChanges();
      const navigationBarElement = fixture.debugElement.query(By.css('.BottomNavigationBar')).nativeElement;

      expect(navigationBarElement.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('when the component has been initialized', () => {
    it('should show all navigation elements', () => {
      const navigationElements = fixture.debugElement.queryAll(By.css('.BottomNavigationBar__element'));
      const expectedNumberOfElements = MOCK_NAVIGATION_ELEMENTS.length;

      expect(navigationElements.length).toEqual(expectedNumberOfElements);
    });

    it('should show navigation elements with their content (icon and text)', () => {
      const MOCK_NAVIGATION_ELEMENT = MOCK_NAVIGATION_ELEMENTS[0];
      const iconElement = fixture.debugElement.query(By.css('.BottomNavigationBar__icon'));
      const activeIconElement = fixture.debugElement.query(By.css('.BottomNavigationBar__icon--active'));
      const textElement = fixture.debugElement.query(By.css('.BottomNavigationBar__text'));

      expect(iconElement.componentInstance.src).toEqual(MOCK_NAVIGATION_ELEMENT.icon);
      expect(activeIconElement.componentInstance.src).toEqual(MOCK_NAVIGATION_ELEMENT.activeIcon);
      expect(textElement.nativeElement.innerHTML).toEqual(MOCK_NAVIGATION_ELEMENT.text);
    });
  });

  describe('when one element has pending notifications', () => {
    it('should show the pending notification badge', () => {
      const MOCK_ELEMENTS_WITH_NOTIFICATION = { ...BOTTOM_NAVIGATION_BAR_ELEMENTS_COLLECTION };
      MOCK_ELEMENTS_WITH_NOTIFICATION[BOTTOM_NAVIGATION_BAR_ELEMENTS.INBOX].pendingNotification = true;

      navigationElementsSubject.next(Object.values(MOCK_ELEMENTS_WITH_NOTIFICATION));
      fixture.detectChanges();
      const pendingNotificationElement = fixture.debugElement.query(By.css('.BottomNavigationBar__pending'));

      expect(pendingNotificationElement).toBeTruthy();
    });
  });

  describe('when using a text input: on focus in', () => {
    it('should hide the tab bar', () => {
      spyOn(bottomNavigationBarService, 'hideNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.TEXT,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(bottomNavigationBarService.hideNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a text input: on focus out', () => {
    it('should show the tab bar', () => {
      spyOn(bottomNavigationBarService, 'showNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.TEXT,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(bottomNavigationBarService.showNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a password input: on focus in', () => {
    it('should hide the tab bar', () => {
      spyOn(bottomNavigationBarService, 'hideNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.PASSWORD,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(bottomNavigationBarService.hideNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a password input: on focus out', () => {
    it('should show the tab bar', () => {
      spyOn(bottomNavigationBarService, 'showNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.PASSWORD,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(bottomNavigationBarService.showNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a number input: on focus in', () => {
    it('should hide the tab bar', () => {
      spyOn(bottomNavigationBarService, 'hideNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.NUMBER,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(bottomNavigationBarService.hideNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a number input: on focus out', () => {
    it('should show the tab bar', () => {
      spyOn(bottomNavigationBarService, 'showNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.NUMBER,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(bottomNavigationBarService.showNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a date input: on focus in', () => {
    it('should hide the tab bar', () => {
      spyOn(bottomNavigationBarService, 'hideNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.DATE,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(bottomNavigationBarService.hideNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a date input: on focus out', () => {
    it('should show the tab bar', () => {
      spyOn(bottomNavigationBarService, 'showNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.DATE,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(bottomNavigationBarService.showNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a radio input: on focus in', () => {
    it('should show the tab bar', () => {
      spyOn(bottomNavigationBarService, 'hideNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.RADIO,
            },
          },
        },
      };

      component.onFocusIn(event);

      expect(bottomNavigationBarService.hideNavigationBar).not.toHaveBeenCalled();
    });
  });

  describe('when using a radio input: on focus out', () => {
    it('should show the tab bar', () => {
      spyOn(bottomNavigationBarService, 'hideNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.INPUT,
          attributes: {
            type: {
              nodeValue: INPUT_TYPE.RADIO,
            },
          },
        },
      };

      component.onFocusOut(event);

      expect(bottomNavigationBarService.hideNavigationBar).not.toHaveBeenCalled();
    });
  });

  describe('when using a textarea: on focus in', () => {
    it('should hide the tab bar', () => {
      spyOn(bottomNavigationBarService, 'hideNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.TEXT_AREA,
        },
      };

      component.onFocusIn(event);

      expect(bottomNavigationBarService.hideNavigationBar).toHaveBeenCalled();
    });
  });

  describe('when using a textarea: on focus out', () => {
    it('should show the tab bar', () => {
      spyOn(bottomNavigationBarService, 'showNavigationBar');
      const event = {
        target: {
          nodeName: ELEMENT_TYPE.TEXT_AREA,
        },
      };

      component.onFocusOut(event);

      expect(bottomNavigationBarService.showNavigationBar).toHaveBeenCalled();
    });
  });
});
