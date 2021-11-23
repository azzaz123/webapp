import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';
import { ButtonComponent } from '@shared/button/button.component';

import { ProModalComponent } from './pro-modal.component';
import { MODAL_ACTION, REDIRECT_TYPE } from './pro-modal.interface';

@Component({
  selector: 'tsl-svg-icon',
  template: '',
})
class MockSvgIconComponent {
  @Input() src: string;
}

describe('ProModalComponent', () => {
  let component: ProModalComponent;
  let fixture: ComponentFixture<ProModalComponent>;
  let activeModal: NgbActiveModal;

  const mockData = {
    img: 'testIcon.svg',
    title: 'testTitle',
    text1: 'testText1',
    text2: 'testText2',
    buttons: {
      primary: {
        text: 'primaryText',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProModalComponent, MockSvgIconComponent, ButtonComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    component.modalConfig = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show title', () => {
    const title: HTMLElement = fixture.debugElement.query(By.css('.ProModal__title')).nativeElement;

    expect(title.textContent).toEqual(mockData.title);
  });

  it('should show icon', () => {
    const element = fixture.debugElement.query(By.css('.ProModal__img')).query(By.directive(MockSvgIconComponent));

    const child: MockSvgIconComponent = element.componentInstance;
    expect(child.src).toBe(mockData.img);
  });

  it('should show first text ', () => {
    const text: HTMLElement = fixture.debugElement.queryAll(By.css('.ProModal__description'))[0].nativeElement;

    expect(text.textContent).toBe(mockData.text1);
  });

  it('should show second text ', () => {
    const text: HTMLElement = fixture.debugElement.queryAll(By.css('.ProModal__description'))[1].nativeElement;

    expect(text.textContent).toBe(mockData.text2);
  });

  describe('Close button', () => {
    describe('and click on cross icon', () => {
      beforeEach(() => {
        spyOn(activeModal, 'close').and.callThrough();
        const button: HTMLElement = fixture.debugElement.query(By.css('.ProModal__close')).nativeElement;

        button.click();
      });
      it('should close modal', () => {
        expect(activeModal.close).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalledWith(undefined);
      });
    });
  });

  describe('Primary button', () => {
    it('should show primary button text ', () => {
      const button: HTMLElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;

      expect(button.textContent.trim()).toEqual(mockData.buttons.primary.text);
    });
    describe('and click on primary button', () => {
      beforeEach(() => {
        spyOn(activeModal, 'close').and.callThrough();
        const button: HTMLElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;

        button.click();
      });
      it('should close modal', () => {
        expect(activeModal.close).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalledWith(MODAL_ACTION.PRIMARY_BUTTON);
      });
    });
    describe('and has external link', () => {
      beforeEach(() => {
        spyOn(activeModal, 'close').and.callThrough();
        component.modalConfig = {
          ...mockData,
          buttons: {
            primary: {
              text: 'primaryText',
              redirect: {
                type: REDIRECT_TYPE.href,
                url: 'wallapop.com',
              },
            },
          },
        };
        fixture.detectChanges();
      });
      it('should have link', () => {
        const link = fixture.debugElement.query(By.css('a'));

        expect(link.attributes['href']).toEqual(component.modalConfig.buttons.primary.redirect.url);
      });

      it('should close modal', () => {
        const button: HTMLElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;

        button.click();

        expect(activeModal.close).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalledWith(MODAL_ACTION.PRIMARY_BUTTON);
      });
    });

    describe('and has internal link', () => {
      beforeEach(() => {
        spyOn(activeModal, 'close').and.callThrough();
        component.modalConfig = {
          ...mockData,
          buttons: {
            primary: {
              text: 'primaryText',
              redirect: {
                type: REDIRECT_TYPE.routerLink,
                url: `/${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`,
              },
            },
          },
        };

        fixture.detectChanges();
      });
      it('should have link', () => {
        const link = fixture.debugElement.query(By.css('a'));

        expect(link.attributes['href']).toEqual(component.modalConfig.buttons.primary.redirect.url);
      });

      it('should close modal', () => {
        const button: HTMLElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;

        button.click();

        expect(activeModal.close).toHaveBeenCalledTimes(1);
        expect(activeModal.close).toHaveBeenCalledWith(MODAL_ACTION.PRIMARY_BUTTON);
      });
    });
  });

  describe('Secondary button', () => {
    describe('and has not a secondary button', () => {
      it('should not show button', () => {
        const button = fixture.debugElement.query(By.css('.btn-secondary'));

        expect(button).toBeFalsy();
      });
    });
    describe('and has a secondary button', () => {
      beforeEach(() => {
        component.modalConfig.buttons.secondary = { text: 'secondaryButton' };
        fixture.detectChanges();
      });
      it('should show button', () => {
        const button = fixture.debugElement.query(By.css('.btn-secondary'));

        expect(button).toBeTruthy();
      });
      it('should show secondary button text ', () => {
        const button: HTMLElement = fixture.debugElement.query(By.css('.btn-secondary')).nativeElement;

        expect(button.textContent).toEqual('secondaryButton');
      });
      describe('and click on secondary button', () => {
        beforeEach(() => {
          spyOn(activeModal, 'close').and.callThrough();
          const button: HTMLElement = fixture.debugElement.query(By.css('.btn-secondary')).nativeElement;

          button.click();
        });
        it('should close modal', () => {
          expect(activeModal.close).toHaveBeenCalledTimes(1);
          expect(activeModal.close).toHaveBeenCalledWith(MODAL_ACTION.SECONDARY_BUTON);
        });
      });
    });
  });
});
