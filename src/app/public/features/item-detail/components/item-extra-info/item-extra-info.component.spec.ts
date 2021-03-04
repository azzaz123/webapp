import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ItemExtraInfoComponent } from './item-extra-info.component';

describe('ItemExtraInfoComponent', () => {
  let component: ItemExtraInfoComponent;
  let fixture: ComponentFixture<ItemExtraInfoComponent>;
  const MOCK_EXTRA_INFO = ['XXL / 48 / 58', 'Diesel'];
  const carStyleClass = '.ItemExtraInfo--car';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemExtraInfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExtraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we NOT have extra info...', () => {
    it('should NOT show any label specification', () => {
      const specifications = fixture.debugElement.queryAll(By.css('label'));

      expect(specifications.length).toBe(0);
    });
  });

  describe('when we have extra info...', () => {
    beforeEach(() => {
      component.extraInfo = MOCK_EXTRA_INFO;
      component.isCar = false;
      fixture.detectChanges();
    });

    it('should show the label specifications', () => {
      const specifications = fixture.debugElement.queryAll(By.css('label'));

      MOCK_EXTRA_INFO.forEach((specification) => {
        expect(
          specifications.find((templateSpecification) => templateSpecification.nativeElement.innerHTML === specification)
        ).toBeTruthy();
      });
      expect(specifications.length).toBe(MOCK_EXTRA_INFO.length);
    });

    describe('when the extra info is basic item...', () => {
      it('should NOT apply the car styles', () => {
        const carStyles = fixture.debugElement.query(By.css(carStyleClass));

        expect(carStyles).toBeFalsy();
      });
    });

    describe('when the extra info is from a car...', () => {
      beforeEach(() => {
        component.isCar = true;
        fixture.detectChanges();
      });

      it('should apply the car styles', () => {
        const carStyles = fixture.debugElement.query(By.css(carStyleClass));

        expect(carStyles).toBeTruthy();
      });
    });
  });
});
