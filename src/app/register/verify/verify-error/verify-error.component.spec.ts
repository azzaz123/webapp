import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyErrorComponent } from './verify-error.component';

describe('VerifyErrorComponent', () => {
  let component: VerifyErrorComponent;
  let fixture: ComponentFixture<VerifyErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyErrorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
