import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinsComponent } from './wallacoins.component';

describe('WallacoinsComponent', () => {
  let component: WallacoinsComponent;
  let fixture: ComponentFixture<WallacoinsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
