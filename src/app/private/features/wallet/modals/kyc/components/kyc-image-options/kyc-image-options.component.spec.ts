import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { KYCImageOptionsComponent } from './kyc-image-options.component';
import { KYC_TAKE_IMAGE_OPTIONS } from './kyc-image-options.enum';

describe('KYCImageOptionsComponent', () => {
  const backButtonSelector = '.KYCImageOptions__back';
  const titleOptionCopySelector = '.GenericCard__title';
  const subtitleOptionCopySelector = '.GenericCard__subtitle';
  const takeImageOptionSelector = '.KYCImageOptions__option';
  const selectedOptionSelector = 'KYCImageOptions__option--selected';

  const continueButtonSelector = '#continueButton';
  const uploadImageOptionSelector = '#uploadOption';
  const shootImageOptionSelector = '#shootOption';

  let component: KYCImageOptionsComponent;
  let fixture: ComponentFixture<KYCImageOptionsComponent>;
  let deviceDetectorService: DeviceDetectorService;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCImageOptionsComponent],
      imports: [FormsModule, ButtonModule, SvgIconModule, HttpClientTestingModule],
      providers: [DeviceDetectorService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCImageOptionsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user clicks on the back button...', () => {
    it('should emit the go back event to go to the previous step', () => {
      spyOn(component.goBack, 'emit');

      de.query(By.css(backButtonSelector)).nativeElement.click();

      expect(component.goBack.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the user clicks on the continue action button...', () => {
    it('should emit the image option change event with the selected method', () => {
      spyOn(component.takeImageOptionChange, 'emit');

      de.query(By.css(continueButtonSelector)).nativeElement.click();

      expect(component.takeImageOptionChange.emit).toHaveBeenCalledTimes(1);
      expect(component.takeImageOptionChange.emit).toHaveBeenCalledWith(component.imageMethod);
    });
  });

  describe('when the user is NOT using a PC...', () => {
    beforeEach(() => {
      spyOn(deviceDetectorService, 'isDesktop').and.returnValue(false);

      fixture.detectChanges();
    });

    it('should show two take images method options', () => {
      const takeImageOptions = de.queryAll(By.css(takeImageOptionSelector)).length;

      expect(takeImageOptions).toBe(2);
    });

    it('should mark the shoot image option as selected', () => {
      const shootOption: HTMLElement = de.query(By.css(shootImageOptionSelector)).nativeElement;

      expect(component.imageMethod).toStrictEqual(KYC_TAKE_IMAGE_OPTIONS.SHOOT);
      expect(shootOption.classList).toContain(selectedOptionSelector);
    });

    it('should show the shoot image option as recommended', () => {
      const shootOption: HTMLElement = de.query(By.css(shootImageOptionSelector)).nativeElement;
      const shootOptionRecommended = shootOption.querySelector(subtitleOptionCopySelector);

      expect(shootOptionRecommended).toBeTruthy();
    });

    it('should NOT mark the upload image option as selected', () => {
      const uploadOption: HTMLElement = de.query(By.css(uploadImageOptionSelector)).nativeElement;
      expect(uploadOption.classList).not.toContain(selectedOptionSelector);
    });

    it('should show the shoot image message with the camera copy option', () => {
      const uploadOption: HTMLElement = de.query(By.css(shootImageOptionSelector)).nativeElement;
      const uploadOptionTitle = uploadOption.querySelector(titleOptionCopySelector).innerHTML;

      expect(uploadOptionTitle).toStrictEqual(
        $localize`:@@kyc_take_or_upload_photo_selector_view_photo_option_description_web_specific:Take photo of the document`
      );
    });
  });

  describe('when the user is using a PC...', () => {
    beforeEach(() => {
      spyOn(deviceDetectorService, 'isDesktop').and.returnValue(true);

      fixture.detectChanges();
    });

    it('should show two take images method options', () => {
      const takeImageOptions = de.queryAll(By.css(takeImageOptionSelector)).length;

      expect(takeImageOptions).toBe(2);
    });

    it('should mark the upload image option as selected', () => {
      const uploadOption: HTMLElement = de.query(By.css(uploadImageOptionSelector)).nativeElement;

      expect(component.imageMethod).toStrictEqual(KYC_TAKE_IMAGE_OPTIONS.UPLOAD);
      expect(uploadOption.classList).toContain(selectedOptionSelector);
    });

    it('should NOT mark the shoot image option as selected', () => {
      const shootOption: HTMLElement = de.query(By.css(shootImageOptionSelector)).nativeElement;
      expect(shootOption.classList).not.toContain(selectedOptionSelector);
    });

    it('should show the upload image option as recommended', () => {
      const uploadOption: HTMLElement = de.query(By.css(uploadImageOptionSelector)).nativeElement;
      const uploadOptionRecommended = uploadOption.querySelector(subtitleOptionCopySelector);

      expect(uploadOptionRecommended).toBeTruthy();
    });

    it('should show the shoot image message with the webcam copy option', () => {
      const uploadOption: HTMLElement = de.query(By.css(shootImageOptionSelector)).nativeElement;
      const uploadOptionTitle = uploadOption.querySelector(titleOptionCopySelector).innerHTML;

      expect(uploadOptionTitle).toStrictEqual(
        $localize`:@@kyc_take_or_upload_photo_selector_view_photo_option_description_web_specific:Take photo of the document`
      );
    });
  });

  describe('when we click on the cross button...', () => {
    beforeEach(() => {
      spyOn(component.closeModal, 'emit');

      fixture.debugElement.query(By.css('.KYCImageOptions__cross')).nativeElement.click();
    });

    it('should close the modal', () => {
      expect(component.closeModal.emit).toHaveBeenCalledTimes(1);
    });
  });
});
