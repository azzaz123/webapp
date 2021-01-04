import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
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
  let checkSessionService: CheckSessionService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CheckSessionDirective, TestComponent],
        providers: [
          CheckSessionService,
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
    checkSessionService = TestBed.inject(CheckSessionService);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('when a click is triggered', () => {
    const click = () => {
      el.querySelector('button').click();
    };

    it('should should redirect user if not logged', () => {
      spyOn(checkSessionService, 'checkSessionAction');

      click();

      expect(checkSessionService.checkSessionAction).toHaveBeenCalled();
    });
  });
});
