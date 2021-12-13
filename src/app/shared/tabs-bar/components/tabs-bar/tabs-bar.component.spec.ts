import { DebugElement } from '@angular/core';
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

describe('TabsBarComponent', () => {
  let component: TabsBarComponent<number>;
  let fixture: ComponentFixture<TabsBarComponent<number>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsBarComponent, TabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<TabsBarComponent<number>>(TabsBarComponent);
    component = fixture.componentInstance;
    component.tabsBarElements = MOCK_TABS_BAR_ELEMENTS;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when rendering the tabs bar component', () => {
    it('should display as many tabs as specified elements', () => {
      const numberOfTabs = fixture.debugElement.queryAll(By.directive(TabComponent)).length;

      expect(numberOfTabs).toBe(MOCK_TABS_BAR_ELEMENTS.length);
    });

    it('should select the first one as default', () => {
      const expectedSelectedTabBar = MOCK_TABS_BAR_ELEMENTS[0];
      const selectedTabComponent: TabComponent<number> = getSelectedTabComponent();

      expect(selectedTabComponent).toBeTruthy();
      expect(selectedTabComponent.tabsBarElement).toBe(expectedSelectedTabBar);
    });
  });

  describe('when user clicks on a non selected tab', () => {
    const secondTab = MOCK_TABS_BAR_ELEMENTS[1];

    beforeEach(() => {
      spyOn(component.handleOnClick, 'emit');

      const secondTabInDOM: TabComponent<number> = fixture.debugElement.queryAll(By.directive(TabComponent))[1].componentInstance;
      secondTabInDOM.handleClick();
      fixture.detectChanges();
    });

    it('should notify the click', () => {
      expect(component.handleOnClick.emit).toHaveBeenCalledTimes(1);
      expect(component.handleOnClick.emit).toHaveBeenCalledWith(secondTab);
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
