import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollingMessageComponent } from './scrolling-message.component';
import { SharedModule } from '../../../shared/shared.module';
import { MatIconModule } from '@angular/material';

describe('ScrollingMessageComponent', () => {
  let component: ScrollingMessageComponent;
  let fixture: ComponentFixture<ScrollingMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule
      ],
      declarations: [
        ScrollingMessageComponent
      ]
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
