import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '../core/services/toast.service';
import { By } from '@angular/platform-browser';
import { Toast, TOAST_TYPES } from '../core/interfaces/toast.interface';
import { ToastModule } from '../toast.module';

describe('ToastComponent', () => {
  let injector: TestBed;
  let fixture: ComponentFixture<ToastComponent>;
  let component: ToastComponent;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    injector = getTestBed();
    toastService = injector.inject<ToastService>(ToastService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('success toast', () => {
    describe('when toast is triggered', () => {
      let toastHTML;
      const MOCKED_TOAST: Toast = { text: 'success toast', type: TOAST_TYPES.SUCCESS };

      beforeEach(() => {
        toastService.show(MOCKED_TOAST);
        fixture.detectChanges();
      });

      it('should remove toast from toast array when toast is clicked', () => {
        toastHTML = fixture.debugElement.query(By.css('ngb-toast'));

        toastHTML.triggerEventHandler('click');

        expect(toastService.toasts).toEqual([]);
      });

      it('should have the `success` class', () => {
        toastHTML = fixture.debugElement.query(By.css('ngb-toast')).nativeNode;
        let firstToastClassName = toastHTML.className.split(' ')[0];

        expect(firstToastClassName).toMatch(MOCKED_TOAST.type);
      });

      it('should show the toast component', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-text')).nativeNode;

        expect(toastHTML).toBeTruthy();
      });

      it('should show the toast text', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-text')).nativeNode;

        expect(toastHTML.innerHTML).toBe(MOCKED_TOAST.text);
      });

      it('should not show the toast title', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-title'));

        expect(toastHTML).toBeFalsy();
      });
    });
  });

  describe('error toast', () => {
    describe('when toast is triggered', () => {
      let toastHTML;
      const MOCKED_TOAST: Toast = { text: 'success toast', type: TOAST_TYPES.ERROR };

      beforeEach(() => {
        toastService.show(MOCKED_TOAST);
        fixture.detectChanges();
      });

      it('should remove toast from toast array when toast is clicked', () => {
        toastHTML = fixture.debugElement.query(By.css('ngb-toast'));

        toastHTML.triggerEventHandler('click');

        expect(toastService.toasts).toEqual([]);
      });

      it('should have the `error` class', () => {
        toastHTML = fixture.debugElement.query(By.css('ngb-toast')).nativeNode;
        let firstToastClassName = toastHTML.className.split(' ')[0];

        expect(firstToastClassName).toMatch(MOCKED_TOAST.type);
      });

      it('should show the toast component', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-text')).nativeNode;

        expect(toastHTML).toBeTruthy();
      });

      it('should show the toast text', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-text')).nativeNode;

        expect(toastHTML.innerHTML).toBe(MOCKED_TOAST.text);
      });

      it('should not show the toast title if there is not toast title', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-title'));

        expect(toastHTML).toBeFalsy();
      });

      it('should show the toast title if there is toast title', () => {
        MOCKED_TOAST.title = 'Oops';

        toastService.show(MOCKED_TOAST);
        fixture.detectChanges();
        toastHTML = fixture.debugElement.query(By.css('.toast-title'));

        expect(toastHTML).toBeTruthy();
      });
    });
  });
});
