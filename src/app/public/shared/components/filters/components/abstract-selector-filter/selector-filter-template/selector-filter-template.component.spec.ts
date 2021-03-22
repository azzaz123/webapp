import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorFilterTemplateComponent } from './selector-filter-template.component';

describe('SelectorFilterTemplateComponent', () => {
  let component: SelectorFilterTemplateComponent;
  let fixture: ComponentFixture<SelectorFilterTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectorFilterTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorFilterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
