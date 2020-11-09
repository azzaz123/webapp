import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateItemsModalComponent } from './activate-items-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ActivateItemsModalComponent', () => {
  let component: ActivateItemsModalComponent;
  let fixture: ComponentFixture<ActivateItemsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivateItemsModalComponent],
      providers: [NgbActiveModal],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
