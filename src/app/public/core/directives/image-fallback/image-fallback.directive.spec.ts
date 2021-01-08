import { ImageFallbackDirective } from './image-fallback.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `<img [src]="src" [fallback]="fallback" />`,
})
class TestComponent {
  src: string;
  fallback: string;
}

describe('ImageFallbackDirective', () => {
  let component: TestComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImageFallbackDirective, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  it('should load fallback on error', () => {
    const imgSelector = 'img';
    const imgElement = de.query(By.css(imgSelector));
    const imgNativeElement = el.querySelector(imgSelector);
    component.src = 'src';
    component.fallback = 'fallback';

    fixture.detectChanges();
    imgElement.triggerEventHandler('error', {});

    expect(imgNativeElement.getAttribute('src')).toEqual(component.fallback);
  });
});
