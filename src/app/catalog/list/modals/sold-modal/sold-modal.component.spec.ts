import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldModalComponent } from './sold-modal.component';

describe('SoldModalComponent', () => {
  let component: SoldModalComponent;
  let fixture: ComponentFixture<SoldModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
