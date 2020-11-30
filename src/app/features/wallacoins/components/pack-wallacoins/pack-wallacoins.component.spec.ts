import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PackWallacoinsComponent } from './pack-wallacoins.component';
import { CustomCurrencyPipe } from '../../../../shared/pipes';
import { DecimalPipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Pack } from '../../../../core/payments/pack';

describe('PackWallacoinsComponent', () => {
  let component: PackWallacoinsComponent;
  let fixture: ComponentFixture<PackWallacoinsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PackWallacoinsComponent, CustomCurrencyPipe],
        providers: [DecimalPipe],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PackWallacoinsComponent);
    component = fixture.componentInstance;
    component.pack = new Pack('id', 100, 100, 'EUR', 'wallacoins');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
