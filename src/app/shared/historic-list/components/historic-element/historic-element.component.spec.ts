import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MOCK_HISTORIC_ELEMENT,
  MOCK_HISTORIC_ELEMENT_WITH_ICON,
  MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION,
} from '@shared/historic-list/fixtures/historic-element.fixtures.spec';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricElementComponent } from './historic-element.component';

@Component({
  selector: 'tsl-test-wrapper-historic-element',
  template: '<tsl-historic-element [historicElement]="historicElement"></tsl-historic-element>',
})
export class TestWrapperHistoricElementComponent {
  @Input() historicElement: HistoricElement;
}

describe('HistoricElementComponent', () => {
  let wrapperComponent: TestWrapperHistoricElementComponent;
  let fixture: ComponentFixture<TestWrapperHistoricElementComponent>;

  const imageSelector = '.HistoricElement__image > img';
  const titleSelector = '.HistoricElement__title > div';
  const moneyAmountSelector = '.HistoricElement__money-amount';
  const descriptionSelector = '.HistoricElement__description';
  const subDescriptionSelector = '.HistoricElement__subDescription';
  const iconSelector = 'tsl-svg-icon';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoricElementComponent, TestWrapperHistoricElementComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperHistoricElementComponent);
    wrapperComponent = fixture.componentInstance;
    wrapperComponent.historicElement = MOCK_HISTORIC_ELEMENT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(wrapperComponent).toBeTruthy();
  });

  describe('when rendering the component', () => {
    it('should show the image', () => {
      const imageElement = fixture.debugElement.query(By.css(imageSelector));
      const itemImageUrl = imageElement.attributes['src'];
      const expecteditemImageUrl = MOCK_HISTORIC_ELEMENT.itemImageUrl;

      expect(itemImageUrl).toEqual(expecteditemImageUrl);
    });

    it('should show the title', () => {
      const titleElement = fixture.debugElement.query(By.css(titleSelector));
      const title = titleElement.nativeElement.innerHTML;
      const expectedTitle = MOCK_HISTORIC_ELEMENT.title;

      expect(title).toEqual(expectedTitle);
    });

    it('should show the amount of money', () => {
      const moneyAmountElement = fixture.debugElement.query(By.css(moneyAmountSelector));
      const moneyAmount = moneyAmountElement.nativeElement.innerHTML;
      const expectedMoneyAmount = MOCK_HISTORIC_ELEMENT.moneyAmmount.toString();

      expect(moneyAmount).toEqual(expectedMoneyAmount);
    });

    it('should show the description', () => {
      const descriptionElement = fixture.debugElement.query(By.css(descriptionSelector));
      const description = descriptionElement.nativeElement.innerHTML.trim();
      const expectedDescription = MOCK_HISTORIC_ELEMENT.description;

      expect(description).toEqual(expectedDescription);
    });

    describe('and when icon URL is defined', () => {
      beforeEach(() => {
        wrapperComponent.historicElement = MOCK_HISTORIC_ELEMENT_WITH_ICON;
        fixture.detectChanges();
      });

      it('should display the icon', () => {
        const iconElement = fixture.debugElement.query(By.css(iconSelector));
        const iconUrl = iconElement.nativeNode.src;
        const expectedIconUrl = MOCK_HISTORIC_ELEMENT_WITH_ICON.iconUrl;

        expect(iconUrl).toEqual(expectedIconUrl);
      });
    });

    describe('and when icon URL is NOT defined', () => {
      beforeEach(() => {
        wrapperComponent.historicElement = MOCK_HISTORIC_ELEMENT;
        fixture.detectChanges();
      });

      it('should NOT display the icon', () => {
        const iconElement = fixture.debugElement.query(By.css(iconSelector));

        expect(iconElement).toBeFalsy();
      });
    });

    describe('and when movement has sub description', () => {
      beforeEach(() => {
        wrapperComponent.historicElement = MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION;
        fixture.detectChanges();
      });

      it('should show the estimated payout description', () => {
        const subDescriptionElement = fixture.debugElement.query(By.css(subDescriptionSelector));
        const subDescription = subDescriptionElement.nativeElement.innerHTML.trim();
        const expectedsubDescription = MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION.subDescription;

        expect(subDescription).toEqual(expectedsubDescription);
      });
    });

    describe('and when movement does NOT have sub description', () => {
      beforeEach(() => {
        wrapperComponent.historicElement = MOCK_HISTORIC_ELEMENT;
        fixture.detectChanges();
      });

      it('should NOT show the estimated payout description', () => {
        const subDescriptionElement = fixture.debugElement.query(By.css(subDescriptionSelector));

        expect(subDescriptionElement).toBeFalsy();
      });
    });
  });
});
