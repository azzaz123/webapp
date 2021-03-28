import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorFilterComponent } from './selector-filter.component';
import { Component, Input } from '@angular/core';
import { AbstractSelectorFilterConfig } from '../abstract-selector-filter/interfaces/selector-filter-config.interface';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-selector-option',
  template: ` <tsl-selector-filter [config]="config"></tsl-selector-filter> `,
})
class TestSelectorOptionComponent {
  @Input() config: AbstractSelectorFilterConfig;
}

describe('SelectorFilterComponent', () => {
  let component: SelectorFilterComponent;
  let fixture: ComponentFixture<SelectorFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectorFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
