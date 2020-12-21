import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { CheckSessionDirective } from './check-session.directive';

@Component({
  template: `<button tslCheckSession></button>`,
})
class TestComponent {
  constructor() {}
}

describe('CheckSessionDirective', () => {
  let component: TestComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckSessionDirective, TestComponent],
        providers: [
          {
            provide: AccessTokenService,
            useValue: {
              accessToken: undefined,
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('when a click is triggered', () => {
    const click = () => {
      el.querySelector('button').click();
    };

    it('should should redirect user if not logged', () => {
      spyOn(window.location, 'assign');

      click();

      expect(window.location['assign']).toHaveBeenCalled();
    });
  });
});
