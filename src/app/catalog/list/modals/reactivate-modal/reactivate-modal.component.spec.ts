import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateModalComponent } from './reactivate-modal.component';

describe('ReactivateModalComponent', () => {
  let component: ReactivateModalComponent;
  let fixture: ComponentFixture<ReactivateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactivateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
