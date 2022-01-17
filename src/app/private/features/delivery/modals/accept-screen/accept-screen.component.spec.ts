import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptScreenComponent } from './accept-screen.component';

describe('AcceptScreenComponent', () => {
  let component: AcceptScreenComponent;
  let fixture: ComponentFixture<AcceptScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptScreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
