import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ItemExtraInfoComponent } from './item-extra-info.component';

describe('ItemExtraInfoComponent', () => {
  let component: ItemExtraInfoComponent;
  let fixture: ComponentFixture<ItemExtraInfoComponent>;
  const MOCK_EXTRA_INFO = ['XXL / 48 / 58', 'Diesel'];

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

  describe(`when we DON'T have extra info...`, () => {
    it('should NOT show any label specification', () => {
      const specifications = fixture.debugElement.queryAll(By.css('label'));

      expect(specifications.length).toBe(0);
    });
  });

  describe('when we have extra info...', () => {
    beforeEach(() => {
      component.extraInfo = MOCK_EXTRA_INFO;
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
  });
});
