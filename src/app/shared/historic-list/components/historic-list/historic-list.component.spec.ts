import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HistoricListComponent } from './historic-list.component';

@Component({
  selector: 'tsl-test-wrapper-historic-list',
  template: '<tsl-historic-list [loading]="loading"></tsl-historic-list>',
})
export class TestWrapperHistoricListComponent {
  @Input() loading: boolean;
}

describe('HistoricListComponent', () => {
  let wrapperComponent: TestWrapperHistoricListComponent;
  let component: HistoricListComponent;
  let fixture: ComponentFixture<TestWrapperHistoricListComponent>;
  let spinnerElement: DebugElement;

  const spinnerSelector = '.spinner';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
});
