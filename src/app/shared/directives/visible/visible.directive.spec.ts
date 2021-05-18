import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { VisibleDirectiveModule } from './visible.directive.module';

@Component({
  template: `<div tslVisible (visible)="onVisible()"></div>`,
})
class TestComponent {
  public isVisibleInBrowser = false;
  public onVisible(): void {
    this.isVisibleInBrowser = true;
  }
}

describe('VisibleDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VisibleDirectiveModule],
      declarations: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  describe('when component is visible in browser', () => {
    beforeEach(() => {
      IntersectionObserver['callback']([{ isIntersecting: true }], { unobserve: () => {} });
      fixture.detectChanges();
    });

    it('should notify is visible', () => expect(component.isVisibleInBrowser).toBe(true));
  });

  describe('when component is NOT visible in browser', () => {
    beforeEach(() => {
      IntersectionObserver['callback']([{ isIntersecting: false }], { unobserve: () => {} });
      fixture.detectChanges();
    });

    it('should do nothing', () => expect(component.isVisibleInBrowser).toBe(false));
  });
});
