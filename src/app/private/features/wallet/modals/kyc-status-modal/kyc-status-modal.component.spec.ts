import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';

import { KYCStatusModalComponent } from './kyc-status-modal.component';

describe('KYCStatusModalComponent', () => {
  let component: KYCStatusModalComponent;
  let fixture: ComponentFixture<KYCStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [KYCStatusModalComponent, SvgIconComponent],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
        {
          provide: Router,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
