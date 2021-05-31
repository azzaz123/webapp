import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlProtocolPipe } from './url-protocol.pipe';

@Component({
  template: '{{url | urlProtocol }}',
})
class TestComponent {
  public url: string;
}

describe('urlProtocolPipe', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [UrlProtocolPipe, TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  describe('when url has protocol ', () => {
    it('should return url without changes', () => {
      const url = 'https://www.wallapop.com';
      component.url = url;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual(url);
    });
  });

  describe('when url has NOT protocol ', () => {
    it('should return url with // at the beginning', () => {
      const url = 'www.wallapop.com';
      component.url = url;

      fixture.detectChanges();

      expect(fixture.debugElement.nativeElement.textContent).toEqual(`//${url}`);
    });
  });
});
