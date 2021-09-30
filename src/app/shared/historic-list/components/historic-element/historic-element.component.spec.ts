import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricElementComponent } from './historic-element.component';

describe('HistoricElementComponent', () => {
  let component: HistoricElementComponent;
  let fixture: ComponentFixture<HistoricElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoricElementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
