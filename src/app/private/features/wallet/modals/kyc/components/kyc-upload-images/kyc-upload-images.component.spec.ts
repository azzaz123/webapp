import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KYC_TAKE_IMAGE_OPTIONS } from '../kyc-image-options/kyc-image-options.enum';
import { KYCUploadImagesComponent } from './kyc-upload-images.component';

describe('KYCUploadImagesComponent', () => {
  let component: KYCUploadImagesComponent;
  let fixture: ComponentFixture<KYCUploadImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCUploadImagesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KYCUploadImagesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user selects the shoot image method', () => {
    beforeEach(() => {
      component.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.SHOOT;
    });

    describe(`and the user's browser supports the API`, () => {
      describe('and the user accept the permission', () => {
        beforeEach(() => {
          spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.resolve());

          fixture.detectChanges();
        });

        it('should ask the user for the camera permission', () => {});
        it('should set the user permissions as accepted', () => {});
        it('should define the webcam video stream', () => {});
        it('should show the video on the template', () => {});
        it('should show the take photo button ', () => {});
      });

      describe('and the user denied the permission', () => {
        beforeEach(() => {
          spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.reject({}));

          fixture.detectChanges();
        });

        it('should ask the user for the camera permission', () => {});
        it('should set the user permissions as denied', () => {});
        it('should show an error banner with permissions refused copy', () => {});
      });

      describe('and a problem other than permit rejection occurs', () => {
        beforeEach(() => {
          spyOn(navigator.mediaDevices, 'getUserMedia').and.returnValue(Promise.reject());

          fixture.detectChanges();
        });

        it('should ask the user for the camera permission', () => {});
        it('should set the user permissions as cannot access', () => {});
        it('should show an error banner with generic copy', () => {});
      });
    });

    describe(`and the user's browser DON'T supports the API`, () => {
      it('should set the user permissions as cannot access', () => {});
      it('should show an error banner with generic copy', () => {});
    });
  });

  describe('when the user selects the upload image method', () => {
    beforeEach(() => {
      component.takeImageMethod = KYC_TAKE_IMAGE_OPTIONS.UPLOAD;

      fixture.detectChanges();
    });

    it('should NOT ask the user for the camera permission', () => {});
  });

  describe('ngOnDestroy', () => {
    describe('and the user camera is defined in the template', () => {
      it('should stop all the camera tracks', () => {});
    });
    describe('and the user camera is NOT defined in the template', () => {
      it('should NOT stop the camera tracks', () => {});
    });
  });
});
