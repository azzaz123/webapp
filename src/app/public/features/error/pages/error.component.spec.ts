import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorBoxModule } from '@shared/error-box/error-box.module';
import { APP_PATHS } from 'app/app-routing-constants';
import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ErrorBoxModule, RouterTestingModule],
        declarations: [ErrorComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the exitClick event is fired', () => {
    it('should redirect to the home page', () => {
      const errorBoxElement = fixture.debugElement.query(By.css('tsl-error-box'));
      spyOn(router, 'navigate');

      errorBoxElement.triggerEventHandler('exitClick', {});

      expect(router.navigate).toHaveBeenCalledWith([APP_PATHS.PUBLIC]);
    });
  });
});
