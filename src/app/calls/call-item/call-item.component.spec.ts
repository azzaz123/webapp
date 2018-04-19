import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallItemComponent } from './call-item.component';

describe('CallItemComponent', () => {
  let component: CallItemComponent;
  let fixture: ComponentFixture<CallItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
