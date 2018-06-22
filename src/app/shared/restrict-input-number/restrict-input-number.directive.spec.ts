import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RestrictInputNumberDirective } from './restrict-input-number.directive';

@Component({
  template: `<form><input type="text" [(ngModel)]="value" name="field" tslRestrictInputNumber /></form>`
})
class TestComponent {
  value: string;
}

describe('RestrictInputNumberDirective', () => {

  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RestrictInputNumberDirective,
        TestComponent
      ],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.queryAll(By.directive(RestrictInputNumberDirective))[0];
    fixture.detectChanges();
  }));

  it('should work', () => {
    expect(element).toBeTruthy();
  });

});
