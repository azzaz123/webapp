import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooManyItemsModalComponent } from './too-many-items-modal.component';

describe('TooManyItemsModalComponent', () => {
  let component: TooManyItemsModalComponent;
  let fixture: ComponentFixture<TooManyItemsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooManyItemsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooManyItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
