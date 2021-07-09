import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycNationalityComponent } from './kyc-nationality.component';

describe('KycNationalityComponent', () => {
  let component: KycNationalityComponent;
  let fixture: ComponentFixture<KycNationalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KycNationalityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycNationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
