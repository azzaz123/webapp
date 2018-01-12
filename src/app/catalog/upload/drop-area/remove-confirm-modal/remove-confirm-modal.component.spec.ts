import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveConfirmModalComponent } from './remove-confirm-modal.component';

describe('RemoveConfirmModalComponent', () => {
  let component: RemoveConfirmModalComponent;
  let fixture: ComponentFixture<RemoveConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveConfirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
