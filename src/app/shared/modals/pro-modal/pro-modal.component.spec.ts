import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';

import { ProModalComponent } from './pro-modal.component';
import { MODAL_ACTION } from './pro-modal.interface';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProModalComponent, MockSvgIconComponent, ButtonComponent],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('and has modal data', () => {
    const mockData = {
      icon: 'testIcon.svg',
      title: 'testTitle',
      text1: 'testText1',
      text2: 'testText2',
      primaryButton: 'TextButton',
    };
    beforeEach(() => {
      component.modalConfig = mockData;
      fixture.detectChanges();
    });
    it('should show title', () => {
      const title: HTMLElement = fixture.debugElement.query(By.css('.ProModal__title')).nativeElement;

      expect(title.textContent).toEqual(mockData.title);
    });
    it('should show icon', () => {
      const element = fixture.debugElement.query(By.css('.ProModal__img')).query(By.directive(MockSvgIconComponent));

      const child: MockSvgIconComponent = element.componentInstance;
      expect(child.src).toBe(mockData.icon);
    });
    it('should show first text ', () => {
      const text: HTMLElement = fixture.debugElement.queryAll(By.css('.ProModal__description'))[0].nativeElement;

      expect(text.textContent).toBe(mockData.text1);
    });
    it('should show second text ', () => {
      const text: HTMLElement = fixture.debugElement.queryAll(By.css('.ProModal__description'))[1].nativeElement;

      expect(text.textContent).toBe(mockData.text2);
    });
    it('should show primary button text ', () => {
      const button: HTMLElement = fixture.debugElement.query(By.css('.btn-primary')).nativeElement;

      expect(button.textContent).toEqual(mockData.primaryButton);
    });
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
  });
});
