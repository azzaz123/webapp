import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateItemsModalComponent } from './deactivate-items-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('DeactivateItemsModalComponent', () => {
  let component: DeactivateItemsModalComponent;
  let fixture: ComponentFixture<DeactivateItemsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeactivateItemsModalComponent],
      providers: [NgbActiveModal],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
