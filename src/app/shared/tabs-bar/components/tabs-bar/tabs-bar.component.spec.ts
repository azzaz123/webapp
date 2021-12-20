import { Component, DebugElement, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { TabComponent } from '../tab/tab.component';

import { TabsBarComponent } from './tabs-bar.component';

const MOCK_TABS_BAR_ELEMENTS: TabsBarElement<number>[] = [
  {
    value: 123,
    label: 'TabTabTab',
  },
  {
    value: 1337,
    label: 'Master of puppies, puppies!',
  },
];
@Component({
  selector: 'tsl-test-tabs-bar',
  template: ` <tsl-tabs-bar
    [tabsBarElements]="tabsBarElements"
    [initialSelectedTabBarElement]="initialSelectedTabBarElement"
    (onChange)="onChange($event)"
  ></tsl-tabs-bar>`,
})
class TestComponent<T> {
  public tabsBarElements: TabsBarElement<T>[];
  public initialSelectedTabBarElement: TabsBarElement<T>;
  public handleOnClick(): void {}
}

describe('TabsBarComponent', () => {
  let wrapperComponent: TestComponent<number>;
  let fixture: ComponentFixture<TestComponent<number>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsBarComponent, TabComponent, TestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<TestComponent<number>>(TestComponent);
    wrapperComponent = fixture.componentInstance;
    wrapperComponent.tabsBarElements = MOCK_TABS_BAR_ELEMENTS;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(wrapperComponent).toBeTruthy();
  });

  describe('when rendering the tabs bar component', () => {
    it('should display as many tabs as specified elements', () => {
      const numberOfTabs = fixture.debugElement.queryAll(By.directive(TabComponent)).length;

      expect(numberOfTabs).toBe(MOCK_TABS_BAR_ELEMENTS.length);
    });

    describe('and there is no initial selected tab specified', () => {
      it('should select the first one as default', () => {
        const expectedSelectedTabBar = MOCK_TABS_BAR_ELEMENTS[0];
        const selectedTabComponent: TabComponent<number> = getSelectedTabComponent();

        expect(selectedTabComponent).toBeTruthy();
        expect(selectedTabComponent.tabsBarElement).toBe(expectedSelectedTabBar);
      });
    });

    describe('and there is initial selected tab specified', () => {
      beforeEach(() => {
        wrapperComponent.initialSelectedTabBarElement = MOCK_TABS_BAR_ELEMENTS[1];
        fixture.detectChanges();
      });

      it('should mark the tab as selected', () => {
        const expectedSelectedTabBar = MOCK_TABS_BAR_ELEMENTS[1];
        const selectedTabComponent: TabComponent<number> = getSelectedTabComponent();

        expect(selectedTabComponent).toBeTruthy();
        expect(selectedTabComponent.tabsBarElement).toBe(expectedSelectedTabBar);
      });
    });
  });

  describe('when user clicks on a non selected tab', () => {
    const secondTab = MOCK_TABS_BAR_ELEMENTS[1];

    beforeEach(() => {
      spyOn(wrapperComponent, 'handleOnClick');

      const secondTabInDOM: TabComponent<number> = fixture.debugElement.queryAll(By.directive(TabComponent))[1].componentInstance;
      secondTabInDOM.handleClick();
      fixture.detectChanges();
    });

    it('should notify the click', () => {
      expect(wrapperComponent.handleOnClick).toHaveBeenCalledTimes(1);
      expect(wrapperComponent.handleOnClick).toHaveBeenCalledWith(secondTab);
    });

    it('should mark the clicked tab as selected', () => {
      const selectedTabComponent: TabComponent<number> = getSelectedTabComponent();

      expect(selectedTabComponent).toBeTruthy();
      expect(selectedTabComponent.tabsBarElement).toBe(secondTab);
    });
  });

  function getSelectedTabComponent(): TabComponent<number> {
    return fixture.debugElement
      .queryAll(By.directive(TabComponent))
      .map((de: DebugElement) => de.componentInstance)
      .find((component: TabComponent<number>) => component.isSelected);
  }
});
