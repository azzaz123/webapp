import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeProModalComponent } from './become-pro-modal.component';

describe('BecomeProModalComponent', () => {
  let component: BecomeProModalComponent;
  let fixture: ComponentFixture<BecomeProModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeProModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeProModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
