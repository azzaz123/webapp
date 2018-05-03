import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityProductsModalComponent } from './visibility-products-modal.component';

describe('VisibilityProductsModalComponent', () => {
  let component: VisibilityProductsModalComponent;
  let fixture: ComponentFixture<VisibilityProductsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibilityProductsModalComponent ]
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
