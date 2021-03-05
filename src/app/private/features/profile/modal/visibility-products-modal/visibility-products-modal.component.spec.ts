import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VisibilityProductsModalComponent } from './visibility-products-modal.component';

describe('VisibilityProductsModalComponent', () => {
  let component: VisibilityProductsModalComponent;
  let fixture: ComponentFixture<VisibilityProductsModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [VisibilityProductsModalComponent],
        providers: [
          {
            provide: NgbActiveModal,
            useValue: {
              close() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilityProductsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
