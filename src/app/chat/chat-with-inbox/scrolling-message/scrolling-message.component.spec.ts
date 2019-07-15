import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollingMessageComponent } from './scrolling-message.component';

describe('ScrollingMessageComponent', () => {
  let component: ScrollingMessageComponent;
  let fixture: ComponentFixture<ScrollingMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrollingMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
