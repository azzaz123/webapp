import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';

import { TabComponent } from './tab.component';

const MOCK_TABS_BAR_ELEMENT: TabsBarElement<number> = {
  value: 123,
  label: 'TabTabTab',
};

describe('TabComponent', () => {
  let component: TabComponent<number>;
  let fixture: ComponentFixture<TabComponent<number>>;
  const tabComponentLabelSelector = 'div';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent<TabComponent<number>>(TabComponent);
    component = fixture.componentInstance;
    component.tabsBarElement = MOCK_TABS_BAR_ELEMENT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when rendering the tab bar element', () => {
    it('should display the specified text', () => {
      const labelText = fixture.debugElement.query(By.css(tabComponentLabelSelector)).nativeElement.innerHTML;

      expect(labelText).toBe(MOCK_TABS_BAR_ELEMENT.label);
    });
  });

  describe('when user clicks on an specific tab', () => {
    it('should notify the click', () => {
      spyOn(component.onClick, 'emit');
      const label = fixture.debugElement.query(By.css(tabComponentLabelSelector)).nativeElement;

      label.click();

      expect(component.onClick.emit).toHaveBeenCalledTimes(1);
      expect(component.onClick.emit).toHaveBeenCalledWith(MOCK_TABS_BAR_ELEMENT);
    });
  });
});
