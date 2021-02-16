import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_ITEM_SPECIFICATIONS } from '@fixtures/item-specifications.fixtures.spec';
import { CounterSpecificationComponent } from '@public/shared/components/counter-specification/counter-specification.component';
import { CounterSpecificationModule } from '@public/shared/components/counter-specification/counter-specification.module';

import { ItemSpecificationsComponent } from './item-specifications.component';

describe('ItemSpecificationsComponent', () => {
  let component: ItemSpecificationsComponent;
  let fixture: ComponentFixture<ItemSpecificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemSpecificationsComponent],
      imports: [CounterSpecificationModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSpecificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`when we don't have item specifications...`, () => {
    it('should not render any counter specification', () => {
      const counterSpecification = fixture.debugElement.query(By.directive(CounterSpecificationComponent));
      expect(counterSpecification).toBeFalsy();
    });
  });

  describe('when we have item specifications...', () => {
    beforeEach(() => {
      component.itemSpecifications = MOCK_ITEM_SPECIFICATIONS;
      fixture.detectChanges();
    });
    it('should render as many counter specifications as item specifications we have', () => {
      const counterSpecification = fixture.debugElement.queryAll(By.directive(CounterSpecificationComponent));
      expect(counterSpecification.length).toBe(component.itemSpecifications.length);
    });
  });
});
