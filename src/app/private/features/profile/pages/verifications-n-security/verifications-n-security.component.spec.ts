import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationsNSecurityComponent } from './verifications-n-security.component';

describe('VerificationsNSecurityComponent', () => {
  let component: VerificationsNSecurityComponent;
  let fixture: ComponentFixture<VerificationsNSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerificationsNSecurityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationsNSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
