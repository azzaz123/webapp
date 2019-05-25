import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VisibilityProductsModalComponent } from './visibility-products-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('VisibilityProductsModalComponent', () => {
  let component: VisibilityProductsModalComponent;
  let fixture: ComponentFixture<VisibilityProductsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilityProductsModalComponent ],
      providers: [
        {
          provide: NgbActiveModal, useValue: {
          close() {
          }
        }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibilityProductsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
