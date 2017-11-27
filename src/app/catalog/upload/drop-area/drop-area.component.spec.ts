import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropAreaComponent } from './drop-area.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ErrorsService, ITEM_ID } from 'shield';
import { UploadService } from './upload.service';
import {
  CAR_ID,
  UPLOAD_FILE,
  UPLOAD_FILE_NAME,
  UPLOADED_FILE_FIRST, UPLOADED_FILE_FIRST_ITEM,
  UPLOADED_FILE_OTHER
} from '../../../../tests/upload.fixtures';
import { UploadFile, UploadStatus } from 'ngx-uploader';

describe('DropAreaComponent', () => {
  let component: DropAreaComponent;
  let fixture: ComponentFixture<DropAreaComponent>;
  let uploadService: UploadService;
  let errorsService: ErrorsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropAreaComponent],
      providers: [
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          }
        }
        },
        {
          provide: UploadService, useValue: {
          createItemWithFirstImage() {
          },
          uploadOtherImages() {
          },
          removeImage() {
          },
          updateOrder() {
          }
        }
        }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropAreaComponent);
    component = fixture.componentInstance;
    uploadService = TestBed.get(UploadService);
    errorsService = TestBed.get(ErrorsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set 4 placehodlers', () => {
      fixture.detectChanges();
      expect(component.placeholders.length).toBe(4);
    });
    it('should set 8 placehodlers', () => {
      component.maxUploads = 8;
      fixture.detectChanges();
      expect(component.placeholders.length).toBe(8);
    });
    it('should subscribe to uploadEvent and call createItemWithFirstImage', () => {
      const VALUES = {
        test: 'test'
      };
      component.files = [UPLOAD_FILE];
      spyOn(uploadService, 'createItemWithFirstImage');
      fixture.detectChanges();
      component.uploadEvent.emit({
        type: 'create',
        values: VALUES
      });
      expect(uploadService.createItemWithFirstImage).toHaveBeenCalledWith(VALUES, UPLOAD_FILE);
    });
  });

  describe('registerOnChange', () => {
    it('should set propagateChange', () => {
      const FUNC: Function = () => {
      };
      component.registerOnChange(FUNC);
      expect(component.propagateChange).toBe(FUNC);
    });
  });

  describe('onUploadOutput', () => {
    it('should add file if event addedToQueue', () => {
      spyOn(component, 'propagateChange');
      component.onUploadOutput({
        type: 'addedToQueue',
        file: UPLOAD_FILE
      });
      expect(component.files[0]).toEqual(UPLOAD_FILE);
      expect(component.propagateChange).toHaveBeenCalledWith(component.files);
      component.onUploadOutput({
        type: 'addedToQueue',
        file: UPLOAD_FILE
      });
      expect(component.files.length).toEqual(2);
    });
    it('should update file if event uploading', () => {
      let fileUploaded: UploadFile = <UploadFile>{...UPLOAD_FILE};
      fileUploaded.progress.data.percentage = 100;
      component.files = [UPLOAD_FILE];
      component.onUploadOutput({
        type: 'uploading',
        file: fileUploaded
      });
      expect(component.files[0].progress.data.percentage).toBe(100);
    });
    it('should remove the file if event removed', () => {
      spyOn(component, 'propagateChange');
      component.files = [UPLOAD_FILE];
      component.onUploadOutput({
        type: 'removed',
        file: UPLOAD_FILE
      });
      expect(component.files.length).toBe(0);
      expect(component.propagateChange).toHaveBeenCalledWith(component.files);
    });
    it('should set dragOver if event dragOver', () => {
      component.onUploadOutput({
        type: 'dragOver'
      });
      expect(component.dragOver).toBeTruthy();
    });
    it('should set dragOver if event dragOut', () => {
      component.onUploadOutput({
        type: 'dragOut'
      });
      expect(component.dragOver).toBeFalsy();
    });
    it('should set dragOver if event drop', () => {
      component.onUploadOutput({
        type: 'drop'
      });
      expect(component.dragOver).toBeFalsy();
    });
    it('should call onUploadDone if event done', () => {
      spyOn<any>(component, 'onUploadDone');
      component.onUploadOutput({
        type: 'done',
        file: UPLOADED_FILE_FIRST
      });
      expect(component['onUploadDone']).toHaveBeenCalledWith({
        type: 'done',
        file: UPLOADED_FILE_FIRST
      });
    });
    it('should call errorsService if event rejected', () => {
      spyOn(errorsService, 'i18nError');
      component.onUploadOutput({
        type: 'rejected',
        file: UPLOAD_FILE,
        reason: 'reason'
      });
      expect(errorsService.i18nError).toHaveBeenCalledWith('reason', UPLOAD_FILE_NAME);
    });
    it('should set files if event orderUpdated', () => {
      component.onUploadOutput({
        type: 'orderUpdated',
        files: [UPLOAD_FILE, UPLOAD_FILE]
      });
      expect(component.files).toEqual([UPLOAD_FILE, UPLOAD_FILE]);
    });
  });

  describe('onUploadDone', () => {
    describe('with response 200', () => {
      describe('first image upload', () => {
        describe('with many images', () => {
          describe('normal item', () => {
            it('should set itemId and call uploadOtherImages', () => {
              component.files = [UPLOAD_FILE, UPLOAD_FILE];
              spyOn(uploadService, 'uploadOtherImages');
              component['onUploadDone']({
                type: 'done',
                file: UPLOADED_FILE_FIRST_ITEM
              });
              expect(component['itemId']).toBe(ITEM_ID);
              expect(uploadService.uploadOtherImages).toHaveBeenCalledWith(ITEM_ID, '');
            });
          });
          describe('car item', () => {
            it('should set itemId and call uploadOtherImages', () => {
              component.files = [UPLOAD_FILE, UPLOAD_FILE];
              component.maxUploads = 8;
              spyOn(uploadService, 'uploadOtherImages');
              component['onUploadDone']({
                type: 'done',
                file: UPLOADED_FILE_FIRST
              });
              expect(component['itemId']).toBe(CAR_ID);
              expect(uploadService.uploadOtherImages).toHaveBeenCalledWith(CAR_ID, '/cars');
            });
          });
        });
        describe('with only one image', () => {
          it('should set itemId and emit onUploaded event', () => {
            let response: string;
            component.files = [UPLOAD_FILE];
            component.onUploaded.subscribe((r: string) => {
              response = r;
            });
            component['onUploadDone']({
              type: 'done',
              file: UPLOADED_FILE_FIRST
            });
            expect(component['itemId']).toBe(CAR_ID);
            expect(response).toEqual(CAR_ID);
          });
        });
      });
      describe('other image upload', () => {
        it('should emit onUploaded event if every file has been uploaded', () => {
          let response: string;
          let fileUploaded: UploadFile = <UploadFile>{...UPLOAD_FILE};
          fileUploaded.progress.status = UploadStatus.Done;
          component.files = [fileUploaded, fileUploaded, fileUploaded];
          component['itemId'] = CAR_ID;
          component.onUploaded.subscribe((r: string) => {
            response = r;
          });
          component['onUploadDone']({
            type: 'done',
            file: UPLOADED_FILE_OTHER
          });
          expect(response).toEqual(CAR_ID);
        });
        it('should NOT emit onUploaded event if not every file has been uploaded', () => {
          let response: string;
          let fileUploaded: UploadFile = <UploadFile>{...UPLOAD_FILE};
          fileUploaded.progress.status = UploadStatus.Done;
          component.files = [fileUploaded, fileUploaded, UPLOAD_FILE];
          component.onUploaded.subscribe((r: string) => {
            response = r;
          });
          component['onUploadDone']({
            type: 'done',
            file: UPLOADED_FILE_OTHER
          });
          expect(response).toBeUndefined();
        });
      });
    });
    describe('with error response', () => {
      it('should call i18nError', () => {
        let fileUploaded: UploadFile = <UploadFile>{...UPLOAD_FILE};
        let response: any;
        fileUploaded.progress.data.responseStatus = 400;
        fileUploaded.response = {
          message: 'error'
        };
        spyOn(errorsService, 'i18nError');
        component.onError.subscribe((r: any) => {
          response = r;
        });
        component['onUploadDone']({
          type: 'done',
          file: fileUploaded
        });
        expect(errorsService.i18nError).toHaveBeenCalledWith('serverError', 'error');
        expect(response).toEqual(fileUploaded.response);
      });
    });
  });

  describe('remove', () => {
    it('should call removeImage', () => {
      spyOn(uploadService, 'removeImage');
      component.remove(UPLOAD_FILE, new Event(''));
      expect(uploadService.removeImage).toHaveBeenCalledWith(UPLOAD_FILE);
    });
  });

  describe('updateOrder', () => {
    it('should call removeImage', () => {
      spyOn(uploadService, 'updateOrder');
      component.files = [UPLOAD_FILE, UPLOAD_FILE];
      component.updateOrder();
      expect(uploadService.updateOrder).toHaveBeenCalledWith(component.files);
    });
  });
});
