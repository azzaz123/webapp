import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile, UserId } from '@data/user';
import { ProfileMother, UserIdMother } from '@fixtures/data/user/domain';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
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
  let storeMock;

  beforeEach(() => {
    storeMock = {
      select: () => {},
    };
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

      expect(fixture.debugElement.nativeElement.textContent).toEqual(
        `//${url}`
      );
    });
  });
});
