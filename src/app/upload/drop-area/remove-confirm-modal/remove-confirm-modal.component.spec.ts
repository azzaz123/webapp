import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveConfirmModalComponent } from './remove-confirm-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('RemoveConfirmModalComponent', () => {
  let component: RemoveConfirmModalComponent;
  let fixture: ComponentFixture<RemoveConfirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RemoveConfirmModalComponent],
      providers: [NgbActiveModal],
    }).compileComponents();
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
