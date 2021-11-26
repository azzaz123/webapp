import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HISTORIC_ELEMENT_SUBDESCRIPTION_TYPE } from '@shared/historic-list/enums/historic-element-subdescription-type.enum';
import {
  MOCK_HISTORIC_ELEMENT,
  MOCK_HISTORIC_ELEMENT_WITH_ICON,
  MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION,
  MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION_ERROR,
  MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION_VALID,
} from '@shared/historic-list/fixtures/historic-element.fixtures.spec';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricElementComponent } from './historic-element.component';

@Component({
  selector: 'tsl-test-wrapper-historic-element',
  template:
    '<tsl-historic-element [historicElement]="historicElement" [clickable]="clickable" (clicked)="onClick($event)"></tsl-historic-element>',
})
export class TestWrapperHistoricElementComponent {
  @Input() historicElement: HistoricElement;
  @Input() clickable: boolean;
  onClick(_historicElement: HistoricElement): void {}
}

describe('HistoricElementComponent', () => {
  let wrapperComponent: TestWrapperHistoricElementComponent;
  let fixture: ComponentFixture<TestWrapperHistoricElementComponent>;

  const historicElementSelector = '.HistoricElement';
  const imageSelector = `${historicElementSelector}__image > img`;
  const iconSelector = `${historicElementSelector}__icon > img`;
  const titleSelector = `${historicElementSelector}__title > div`;
  const moneyAmountSelector = `${historicElementSelector}__money-amount`;
  const descriptionSelector = `${historicElementSelector}__description`;
  const subDescriptionSelector = `${historicElementSelector}__subDescription`;
  const subDescriptionValidSelector = `${historicElementSelector}__subDescription--valid`;
  const subDescriptionErrorSelector = `${historicElementSelector}__subDescription--error`;
  const clickableSelector = `${historicElementSelector}--clickable`;

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
      const imageUrl = imageElement.attributes['src'];
      const expectedImageUrl = MOCK_HISTORIC_ELEMENT.imageUrl;

      expect(imageUrl).toEqual(expectedImageUrl);
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
      const expectedMoneyAmount = MOCK_HISTORIC_ELEMENT.moneyAmount.toString();

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

    describe('and when movement has subdescription', () => {
      beforeEach(() => {
        wrapperComponent.historicElement = MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION;
        fixture.detectChanges();
      });

      it('should show the subdescription text', () => {
        const subDescriptionElement = fixture.debugElement.query(By.css(subDescriptionSelector));
        const subDescription = subDescriptionElement.nativeElement.innerHTML.trim();
        const expectedsubDescription = MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION.subDescription.text;

        expect(subDescription).toEqual(expectedsubDescription);
      });

      describe('and when subdescription is normal', () => {
        it('should NOT add extra styling', () => {
          const subDescriptionValidElement = fixture.debugElement.query(By.css(subDescriptionValidSelector));
          const subDescriptionErrorElement = fixture.debugElement.query(By.css(subDescriptionValidSelector));

          expect(subDescriptionValidElement).toBeFalsy();
          expect(subDescriptionErrorElement).toBeFalsy();
        });
      });

      describe('and when subdescription is valid', () => {
        beforeEach(() => {
          wrapperComponent.historicElement = MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION_VALID;
          fixture.detectChanges();
        });

        it('should add subdescription valid style', () => {
          const subDescriptionValidElement = fixture.debugElement.query(By.css(subDescriptionValidSelector));

          expect(subDescriptionValidElement).toBeTruthy();
        });
      });

      describe('and when subdescription is error', () => {
        beforeEach(() => {
          wrapperComponent.historicElement = MOCK_HISTORIC_ELEMENT_WITH_SUB_DESCRIPTION_ERROR;
          fixture.detectChanges();
        });

        it('should add subdescription error style', () => {
          const subDescriptionErrorElement = fixture.debugElement.query(By.css(subDescriptionErrorSelector));

          expect(subDescriptionErrorElement).toBeTruthy();
        });
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

    describe('WHEN user clicks over the item', () => {
      it('should send the event with the item as a payload', () => {
        spyOn(wrapperComponent, 'onClick');
        const historicElement = fixture.debugElement.query(By.css(historicElementSelector));

        historicElement.nativeElement.click();

        expect(wrapperComponent.onClick).toHaveBeenCalledTimes(1);
        expect(wrapperComponent.onClick).toHaveBeenCalledWith(MOCK_HISTORIC_ELEMENT);
      });
    });

    describe('and when element is clickable', () => {
      beforeEach(() => {
        wrapperComponent.clickable = true;
        fixture.detectChanges();
      });

      it('should apply clickable styles', () => {
        const historicElement = fixture.debugElement.query(By.css(clickableSelector));
        expect(historicElement).toBeTruthy();
      });
    });

    describe('and when element is NOT clickable', () => {
      beforeEach(() => {
        wrapperComponent.clickable = false;
        fixture.detectChanges();
      });

      it('should apply clickable styles', () => {
        const historicElement = fixture.debugElement.query(By.css(clickableSelector));
        expect(historicElement).toBeFalsy();
      });
    });
  });
});
