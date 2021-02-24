import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EllapsedTimePipe } from './ellapsed-time.pipe';

@Component({
  template: '{{date | ellapsedTime}}',
})
class TestComponent {
  public date: number;
}

describe('isCurrentUserPipe', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [EllapsedTimePipe, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });
});
