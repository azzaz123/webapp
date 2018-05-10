import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprModalComponent } from './gdpr-modal.component';

describe('GdprModalComponent', () => {
  let component: GdprModalComponent;
  let fixture: ComponentFixture<GdprModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdprModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
