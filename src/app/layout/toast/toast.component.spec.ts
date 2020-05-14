import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';
import { By } from '@angular/platform-browser';
import { Toast } from './toast.interface';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('ToastComponent', () => {
  let injector: TestBed;
  let fixture: ComponentFixture<ToastComponent>;
  let component: ToastComponent;
  let toastService: ToastService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[NgbModule],
      providers: [{
        provide: toastService, useValue: {
          toasts: []
        }
      }],
      declarations: [ToastComponent]
    })
      .compileComponents();
  }));

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
      const MOCKED_TOAST: Toast = { text: 'success toast', type: 'success' }
  
      beforeEach(() => {
        toastService.show(MOCKED_TOAST);
        fixture.detectChanges();
      })

      it('should have the `success` class', () => {
         toastHTML = fixture.debugElement.query(By.css('ngb-toast')).nativeNode;
         let firstToastClassName = toastHTML.className.split(' ')[0]
         expect(firstToastClassName).toMatch(MOCKED_TOAST.type)
       })
  
      it('should show the toast component', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-test')).nativeNode;
        expect(toastHTML).toBeTruthy();
      })
  
      it('should show the toast text', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-test')).nativeNode;

        expect(toastHTML.innerHTML).toBe(MOCKED_TOAST.text)
      })

      it('should not show the toast title', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-title'));
        expect(toastHTML).toBeFalsy();
      })
    })
  })

  describe('error toast', () => {
    describe('when toast is triggered', () => {
      let toastHTML;
      const MOCKED_TOAST: Toast = { text: 'success toast', type: 'error'}

      beforeEach(() => {
        toastService.show(MOCKED_TOAST);
        fixture.detectChanges();
      })

      it('should have the `error` class', () => {
        toastHTML = fixture.debugElement.query(By.css('ngb-toast')).nativeNode;
        let firstToastClassName = toastHTML.className.split(' ')[0]
        expect(firstToastClassName).toMatch(MOCKED_TOAST.type)
      })

      it('should show the toast component', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-test')).nativeNode;
        expect(toastHTML).toBeTruthy();
      })

      it('should show the toast text', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-test')).nativeNode;
        expect(toastHTML.innerHTML).toBe(MOCKED_TOAST.text)
      })

      it('should not show the toast title if there is not toast title', () => {
        toastHTML = fixture.debugElement.query(By.css('.toast-title'));
        expect(toastHTML).toBeFalsy();
      })

      it('should show the toast title if there is toast title', () => {
        MOCKED_TOAST.title = 'Oops';
        toastService.show(MOCKED_TOAST);
        fixture.detectChanges();
        toastHTML = fixture.debugElement.query(By.css('.toast-title'));
        expect(toastHTML).toBeTruthy();
      })

    })
  });
});
