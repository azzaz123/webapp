import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MOCK_HISTORIC_LIST_EMPTY } from '@shared/historic-list/fixtures/historic-list.fixtures.spec';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { InfiniteScrollModule } from '@shared/infinite-scroll/infinite-scroll.module';
import { HistoricListComponent } from './historic-list.component';

@Component({
  selector: 'tsl-test-wrapper-historic-list',
  template:
    '<tsl-historic-list [loading]="loading" [infiniteScrollDisabled]="infiniteScrollDisabled" [historicList]="historicList" (scrolled)="handleScroll()"></tsl-historic-list>',
})
export class TestWrapperHistoricListComponent {
  @Input() loading: boolean;
  @Input() infiniteScrollDisabled = false;
  @Input() historicList: HistoricList;

  public handleScroll(): void {}
}

describe('HistoricListComponent', () => {
  let wrapperComponent: TestWrapperHistoricListComponent;
  let component: HistoricListComponent;
  let fixture: ComponentFixture<TestWrapperHistoricListComponent>;
  let spinnerElement: DebugElement;

  const spinnerSelector = '.spinner';
  const emptyStateSelector = '.HistoricList__no-results';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfiniteScrollModule],
      declarations: [TestWrapperHistoricListComponent, HistoricListComponent],
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

  describe('when the UI is loading', () => {
    beforeEach(() => {
      wrapperComponent.loading = true;
      fixture.detectChanges();
      spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));
    });

    it('should show a loading spinner', () => {
      expect(spinnerElement).toBeTruthy();
    });

    it('should use valid icon path', () => {
      const spinnerIconUrl = spinnerElement.nativeNode.src;

      expect(spinnerIconUrl).toEqual(component.loadingIconSrc);
    });
  });

  describe('when the UI is NOT loading', () => {
    beforeEach(() => {
      wrapperComponent.loading = false;
      fixture.detectChanges();
      spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));
    });

    it('should NOT show a loading spinner', () => {
      const spinnerElement = fixture.debugElement.query(By.css(spinnerSelector));

      expect(spinnerElement).toBeFalsy();
    });
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
});
