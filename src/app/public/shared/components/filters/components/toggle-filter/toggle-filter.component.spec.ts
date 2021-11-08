import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';
import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FILTER_TYPES } from '../../core/enums/filter-types/filter-types.enum';
import { FilterParameter } from '../../interfaces/filter-parameter.interface';
import { FILTER_VARIANT } from '../abstract-filter/abstract-filter.enum';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { ToggleFilterComponent } from './toggle-filter.component';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { IsBubblePipe } from '../abstract-filter/pipes/is-bubble.pipe';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

describe('ToggleFilterComponent', () => {
  let component: ToggleFilterComponent;
  let fixture: ComponentFixture<ToggleFilterComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const formatValue = (value: boolean): FilterParameter[] => {
    return [{ key: component.config.mapKey.key, value: value.toString() }];
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToggleFilterComponent, IsBubblePipe],
      imports: [CommonModule, ToggleFormModule, FormsModule, AbstractFilterModule, HttpClientTestingModule],
      providers: [
        DeviceDetectorService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleFilterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;

    component.config = {
      id: COMMON_CONFIGURATION_ID.CATEGORIES,
      type: FILTER_TYPES.TOGGLE,
      mapKey: {
        key: FILTER_QUERY_PARAM_KEY.warranty,
      },
      title: 'Warranty',
      icon: '/assets/icons/joke.svg',
      bubblePlaceholder: 'Has warranty',
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when is bubble', () => {
    const bubbleClick = () => {
      const filterSelector = 'tsl-bubble';
      fixture.debugElement.query(By.css(filterSelector)).nativeElement.click();
    };

    const clearClick = () => {
      const clearSelector = '.Bubble__clear';
      fixture.debugElement.query(By.css(clearSelector)).nativeElement.click();
    };

    beforeEach(() => {
      component.variant = FILTER_VARIANT.BUBBLE;
      fixture.detectChanges();
    });

    describe('and has no value defined', () => {
      beforeEach(() => {
        component.toggle = undefined;
      });

      it('should toggle true value on click', () => {
        fixture.detectChanges();

        bubbleClick();

        expect(component.toggle).toBeTruthy();
      });

      it('should format the value correctly on click', () => {
        bubbleClick();

        expect(component.value).toEqual(formatValue(true));
      });
    });

    describe('and has value false', () => {
      beforeEach(() => {
        component.toggle = false;
        component['hasValueSubject'].next(component.toggle);
      });

      it('should toggle true value on click', () => {
        fixture.detectChanges();

        bubbleClick();

        expect(component.toggle).toBeTruthy();
      });

      it('should format the value correctly on click', () => {
        bubbleClick();

        expect(component.value).toEqual(formatValue(true));
      });
    });

    describe('and has value true', () => {
      beforeEach(() => {
        component.toggle = true;
        component['hasValueSubject'].next(component.toggle);
      });

      it('should toggle false value on click', () => {
        fixture.detectChanges();

        bubbleClick();

        expect(component.toggle).toBeFalsy();
      });

      it('should toggle false value on clear', () => {
        fixture.detectChanges();

        clearClick();

        expect(component.toggle).toBeFalsy();
      });

      it('should format the value correctly on click', () => {
        bubbleClick();

        expect(component.value).toEqual([]);
      });
    });
  });

  describe('when is content', () => {
    const toggleClick = () => {
      const toggleSelector = 'tsl-toggle-form input';
      fixture.debugElement.query(By.css(toggleSelector)).nativeElement.click();
    };

    beforeEach(async () => {
      fixture = TestBed.createComponent(ToggleFilterComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      el = de.nativeElement;

      component.variant = FILTER_VARIANT.CONTENT;

      component.config = {
        id: COMMON_CONFIGURATION_ID.CATEGORIES,
        type: FILTER_TYPES.TOGGLE,
        mapKey: {
          key: FILTER_QUERY_PARAM_KEY.warranty,
        },
        title: 'Warranty',
        icon: '/assets/icons/joke.svg',
        bubblePlaceholder: 'Has warranty',
      };

      fixture.detectChanges();
    });

    describe('and has no value defined', () => {
      beforeEach(() => {
        component.toggle = undefined;
      });

      it('should toggle true value on click', () => {
        toggleClick();
        expect(component.toggle).toBeTruthy();
      });

      it('should format the value correctly on click', () => {
        toggleClick();
        expect(component.value).toEqual(formatValue(true));
      });
    });

    describe('and has value true', () => {
      beforeEach(() => {
        toggleClick();
      });

      it('should toggle false value on click', () => {
        toggleClick();
        fixture.detectChanges();
        expect(component.toggle).toBeFalsy();
      });
    });

    describe('and has value false', () => {
      beforeEach(() => {
        component.toggle = false;
      });

      it('should toggle true value on click', () => {
        toggleClick();

        expect(component.toggle).toBeTruthy();
      });

      it('should format the value correctly on click', () => {
        toggleClick();
        expect(component.value).toEqual(formatValue(true));
      });
    });
  });

  describe('when value changes from parent', () => {
    describe('and original value is empty', () => {
      beforeEach(() => {
        component.value = [];
      });

      it('should set the provided value', () => {
        component.value = [{ key: FILTER_QUERY_PARAM_KEY.warranty, value: 'true' }];

        expect(component.toggle).toBeTruthy();
      });
    });

    describe('and original value has content', () => {
      beforeEach(() => {
        component.value = [{ key: FILTER_QUERY_PARAM_KEY.warranty, value: 'true' }];
      });

      it('should clean up the value', () => {
        component.value = [];

        expect(component.toggle).toBeFalsy();
      });
    });
  });
});
