import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';

import { KYCImageOptionsComponent } from './kyc-image-options.component';
import { KYC_TAKE_IMAGE_OPTIONS } from './kyc-image-options.enum';

describe('KYCImageOptionsComponent', () => {
  const backButtonSelector = '.KYCImageOptions__back';
  const continueButtonSelector = '#continueButton';

  let component: KYCImageOptionsComponent;
  let fixture: ComponentFixture<KYCImageOptionsComponent>;
  let deviceDetectorService: DeviceDetectorService;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCImageOptionsComponent],
      imports: [FormsModule],
      providers: [DeviceDetectorService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCImageOptionsComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    fixture.detectChanges();
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

  describe('when the user selects the upload image option...', () => {
    it('should mark the upload image option as selected', () => {
      component.imageMethod = KYC_TAKE_IMAGE_OPTIONS.UPLOAD;
    });
  });

  describe('when the user selects the take image option...', () => {
    it('should mark the shoot image option as selected', () => {
      component.imageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
    });
  });

  describe('when the user is using a mobile...', () => {
    beforeEach(() => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(true);
      component.ngOnInit();
    });

    it('should show two take images method options', () => {});
    it('should mark the take picture option as default', () => {
      expect(component.imageMethod).toStrictEqual(KYC_TAKE_IMAGE_OPTIONS.SHOOT);
    });
    it('should show the take picture with the camera copy option', () => {});
  });

  describe('when the user is NOT using a mobile...', () => {
    beforeEach(() => {
      spyOn(deviceDetectorService, 'isMobile').and.returnValue(false);
    });
    it('should show two take images method options', () => {});
    it('should mark the upload picture option as default', () => {
      expect(component.imageMethod).toStrictEqual(KYC_TAKE_IMAGE_OPTIONS.UPLOAD);
    });
    it('should show the take picture with the webcam copy option', () => {});
  });
});
