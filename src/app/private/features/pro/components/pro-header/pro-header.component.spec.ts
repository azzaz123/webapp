import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProHeaderComponent } from './pro-header.component';

describe('ProHeaderComponent', () => {
  let component: ProHeaderComponent;
  let fixture: ComponentFixture<ProHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
