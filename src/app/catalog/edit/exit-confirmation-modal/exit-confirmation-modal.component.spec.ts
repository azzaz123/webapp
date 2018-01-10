import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitConfirmationModalComponent } from './exit-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ExitConfirmationModalComponent', () => {
  let component: ExitConfirmationModalComponent;
  let fixture: ComponentFixture<ExitConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitConfirmationModalComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
