import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_HISTORIC_ELEMENT } from '@shared/historic-list/fixtures/historic-element.fixtures.spec';
import {
  MOCK_HISTORIC_LIST,
  MOCK_HISTORIC_LIST_EMPTY,
  MOCK_HISTORIC_LIST_WITH_BALANCE,
} from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { InfiniteScrollModule } from '@shared/infinite-scroll/infinite-scroll.module';
import { HistoricElementComponent } from '../historic-element/historic-element.component';
import { HistoricListComponent } from './historic-list.component';

@Component({
  selector: 'tsl-test-wrapper-historic-list',
  template: `<tsl-historic-list
    [loading]="loading"
    [infiniteScrollDisabled]="infiniteScrollDisabled"
    [historicList]="historicList"
    [showTotalBalance]="showTotalBalance"
    (scrolled)="handleScroll()"
    (clicked)="onItemClick($event)"
  ></tsl-historic-list>`,
})
export class TestWrapperHistoricListComponent {
  @Input() loading = true;
  @Input() infiniteScrollDisabled = false;
  @Input() historicList: HistoricList;
  @Input() showTotalBalance = true;

  public handleScroll(): void {}
  public onItemClick(historicElement: HistoricElement): void {}
}

describe('HistoricListComponent', () => {
  let wrapperComponent: TestWrapperHistoricListComponent;
  let component: HistoricListComponent;
  let fixture: ComponentFixture<TestWrapperHistoricListComponent>;

  const emptyStateSelector = '.HistoricList__no-results';
  const totalBalanceSelector = '.HistoricList__total-balance';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, InfiniteScrollModule],
      declarations: [TestWrapperHistoricListComponent, HistoricListComponent, HistoricElementComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperHistoricListComponent);
    wrapperComponent = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.query(By.directive(HistoricListComponent)).componentInstance;
  });

  it('should create', () => {
    expect(wrapperComponent).toBeTruthy();
  });

  describe('when scrolling is enabled', () => {
    beforeEach(() => {
      wrapperComponent.infiniteScrollDisabled = false;
      fixture.detectChanges();
    });

    describe('and when user scrolls', () => {
      beforeEach(() => {
        spyOn(wrapperComponent, 'handleScroll');
        window.dispatchEvent(new CustomEvent('scroll'));
      });

      it('should notify scroll', () => {
        expect(wrapperComponent.handleScroll).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when scrolling is NOT enabled', () => {
    beforeEach(() => {
      wrapperComponent.infiniteScrollDisabled = true;
      fixture.detectChanges();
    });

    describe('and when user scrolls', () => {
      beforeEach(() => {
        spyOn(wrapperComponent, 'handleScroll');
        window.dispatchEvent(new CustomEvent('scroll'));
      });

      it('should NOT notify scroll', () => {
        expect(wrapperComponent.handleScroll).not.toHaveBeenCalled();
      });
    });
  });

  describe('when displaying an empty list', () => {
    beforeEach(() => {
      wrapperComponent.historicList = MOCK_HISTORIC_LIST_EMPTY;
      fixture.detectChanges();
    });

    it('should show no results found', () => {
      const emptyStateElement = fixture.debugElement.query(By.css(emptyStateSelector));
      const expectedText = $localize`:@@web_no_results:No results found`;
      const result = emptyStateElement.nativeElement.innerHTML.trim();

      expect(result).toEqual(expectedText);
    });
  });

  describe('when displaying an historic list with elements', () => {
    beforeEach(() => {
      wrapperComponent.historicList = MOCK_HISTORIC_LIST;
      fixture.detectChanges();
    });

    it('should show all historic elements', () => {
      const historicElements = fixture.debugElement.queryAll(By.directive(HistoricElementComponent));
      let totalHistoricElements = 0;
      MOCK_HISTORIC_LIST.elements.forEach((h) => h.elements.forEach((st) => st.elements.forEach(() => totalHistoricElements++)));

      expect(historicElements.length).toBe(totalHistoricElements);
    });
  });

  describe('when displaying an historic list with elements and total balance', () => {
    beforeEach(() => {
      wrapperComponent.historicList = MOCK_HISTORIC_LIST_WITH_BALANCE;
      fixture.detectChanges();
    });

    describe('and when specifying to display total balance', () => {
      beforeEach(() => {
        wrapperComponent.showTotalBalance = true;
        fixture.detectChanges();
      });

      it('should show total balance only once', () => {
        const totalBalanceElements = fixture.debugElement.queryAll(By.css(totalBalanceSelector));

        expect(totalBalanceElements.length).toBe(1);
      });

      it('should show total balance', () => {
        const totalBalanceElement = fixture.debugElement.query(By.css(totalBalanceSelector));
        const expectedText = $localize`:@@movements_history_all_users_current_balance_label:Current balance: ${MOCK_HISTORIC_LIST_WITH_BALANCE.totalBalance}`;
        const result = totalBalanceElement.nativeElement.innerHTML.trim();

        expect(result).toBe(expectedText);
      });
    });

    describe('and when specifying to NOT display total balance', () => {
      beforeEach(() => {
        wrapperComponent.showTotalBalance = false;
        fixture.detectChanges();
      });

      it('should NOT show the total balance', () => {
        const totalBalanceElement = fixture.debugElement.query(By.css(totalBalanceSelector));

        expect(totalBalanceElement).toBeFalsy();
      });
    });

    describe('WHEN user clicks over the item', () => {
      it('should send the event with the item as a payload', () => {
        spyOn(component.itemClicked, 'emit').and.callFake(() => {});

        component.onItemClick(MOCK_HISTORIC_ELEMENT);

        expect(component.itemClicked.emit).toHaveBeenCalledTimes(1);
        expect(component.itemClicked.emit).toHaveBeenCalledWith(MOCK_HISTORIC_ELEMENT);
      });
    });
  });
});
