import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SvgIconStubComponent } from '@fixtures/shared/components/svg-icon.component.stub';
import { of } from 'rxjs';
import { BOTTOM_NAVIGATION_BAR_ELEMENTS } from '../constants/bottom-navigation-bar-elements';
import { BottomNavigationBarService } from '../services/bottom-navigation-bar.service';

import { BottomNavigationBarComponent, ELEMENT_TYPE, INPUT_TYPE } from './bottom-navigation-bar.component';

describe('BottomNavigationBarComponent', () => {
  let component: BottomNavigationBarComponent;
  let fixture: ComponentFixture<BottomNavigationBarComponent>;
  let bottomNavigationBarService: BottomNavigationBarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BottomNavigationBarComponent, SvgIconStubComponent],
      providers: [
        {
          provide: BottomNavigationBarService,
          useValue: {
            navigationElements$: of(Object.values(BOTTOM_NAVIGATION_BAR_ELEMENTS)),
            showNavigationBar() {},
            hideNavigationBar() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomNavigationBarComponent);
    bottomNavigationBarService = TestBed.inject(BottomNavigationBarService);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
