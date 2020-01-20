import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DropAreaComponent } from './drop-area.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UploadService } from './upload.service';
import {
  CAR_ID,
  UPLOAD_FILE, UPLOAD_FILE_DATE,
  UPLOAD_FILE_DONE, UPLOAD_FILE_ID,
  UPLOAD_FILE_NAME,
  UPLOADED_FILE_FIRST,
  UPLOADED_FILE_FIRST_ITEM,
  UPLOADED_FILE_OTHER, UPLOADED_RESPONSE
} from '../../../tests/upload.fixtures.spec';
import { ItemService } from '../../core/item/item.service';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveConfirmModalComponent } from './remove-confirm-modal/remove-confirm-modal.component';
import { ITEM_ID, PICTURE_ID } from '../../../tests/item.fixtures.spec';
import { ErrorsService } from '../../core/errors/errors.service';
import { IMAGE } from '../../../tests/user.fixtures.spec';
import { UploadedEvent } from '../upload-event.interface';
import { ITEM_TYPES } from '../../core/item/item';
import { UploadFile, UploadStatus } from '../../shared/uploader/upload.interface';

describe('DropAreaComponent', () => {
  let component: DropAreaComponent;
  let fixture: ComponentFixture<DropAreaComponent>;
  let uploadService: UploadService;
  let errorsService: ErrorsService;
  let itemService: ItemService;
  let modalService: NgbModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropAreaComponent],
      providers: [
        {
          provide: ErrorsService, useValue: {
          i18nError() {
          },
          i18nSuccess() {
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
          },
          setInitialImages() {
          },
          uploadSingleImage() {
          }
        }
        },
        {
          provide: ItemService, useValue: {
          update() {
            return Observable.of({});
          },
          updatePicturesOrder() {
            return Observable.of({});
          },
          deletePicture() {
            return Observable.of({});
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              result: Promise.resolve()
            };
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
    itemService = TestBed.get(ItemService);
    modalService = TestBed.get(NgbModal);
  });

  describe('ngOnInit', () => {
    it('should set 10 placehodlers', () => {
      fixture.detectChanges();

      expect(component.placeholders.length).toBe(10);
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
      component.type = ITEM_TYPES.CARS
      spyOn(uploadService, 'createItemWithFirstImage');
      fixture.detectChanges();

      component.uploadEvent.emit({
        type: 'create',
        values: VALUES
      });

      expect(uploadService.createItemWithFirstImage).toHaveBeenCalledWith(VALUES, UPLOAD_FILE, ITEM_TYPES.CARS);
    });

    it('should call update if event is update and emit updated event', () => {
      let event: UploadedEvent;
      const VALUES = {
        test: 'test'
      };
      const response = 'a response';
      component.type = ITEM_TYPES.CARS;
      spyOn(itemService, 'update').and.returnValue(Observable.of(response));
      component.onUploaded.subscribe((value: UploadedEvent) => {
        event = value;
      });
      fixture.detectChanges();

      component.uploadEvent.emit({
        type: 'update',
        values: VALUES
      });

      expect(itemService.update).toHaveBeenCalledWith(VALUES, ITEM_TYPES.CARS);
      expect(event).toEqual( { action: 'updated', response: response } );
    });

    it('should throw error if update has errors from server', () => {
      let event: any;
      const VALUES = {
        test: 'test'
      };
      const ERROR = {
        message: 'error'
      };
      component.type = ITEM_TYPES.CARS;
      spyOn(itemService, 'update').and.returnValue(Observable.throw(ERROR));
      spyOn(errorsService, 'i18nError');
      component.onError.subscribe((value: any) => {
        event = value;
      });
      fixture.detectChanges();

      component.uploadEvent.emit({
        type: 'update',
        values: VALUES
      });

      expect(itemService.update).toHaveBeenCalledWith(VALUES, ITEM_TYPES.CARS);
      expect(event).toEqual(ERROR);
      expect(errorsService.i18nError).toHaveBeenCalledWith('serverError', ERROR.message);
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
        file: UPLOADED_FILE_OTHER
      });
      expect(component.files.length).toEqual(2);
    });

    it('should upload file if event addedToQueue and edit mode', () => {
      component.images = [IMAGE, IMAGE];
      component.itemId = ITEM_ID;
      component.type = ITEM_TYPES.CONSUMER_GOODS;
      spyOn(uploadService, 'uploadSingleImage');

      component.onUploadOutput({
        type: 'addedToQueue',
        file: UPLOAD_FILE
      });

      expect(uploadService.uploadSingleImage).toHaveBeenCalledWith(UPLOAD_FILE, ITEM_ID, ITEM_TYPES.CONSUMER_GOODS);

    });

    describe('if event is uploading', () => {
      it('should update file', () => {
        const fileUploaded: UploadFile = <UploadFile>{...UPLOAD_FILE};
        fileUploaded.progress.data.percentage = 100;
        component.files = [UPLOAD_FILE];
  
        component.onUploadOutput({
          type: 'uploading',
          file: fileUploaded
        });
  
        expect(component.files[0].progress.data.percentage).toBe(100);
      });
  
      it('should emit the completed upload percentage', () => {
        const fileUploaded: UploadFile = <UploadFile>{...UPLOAD_FILE};
        component.files = [UPLOAD_FILE];
        spyOn(component.onUploadPercentageChange, 'emit');
  
        component.onUploadOutput({
          type: 'uploading',
          file: fileUploaded,
          percentage: 54.23
        });
  
        expect(component.onUploadPercentageChange.emit).toHaveBeenCalledWith(54.23);
      });
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

    it('should set initial files if there are images and event is ready', fakeAsync(() => {
      component.images = [IMAGE, IMAGE];
      spyOn(uploadService, 'setInitialImages');
      spyOn(component, 'propagateChange');

      component.onUploadOutput({
        type: 'ready'
      });
      tick();

      expect(component.files[0].fileIndex).toBe(0);
      expect(component.files[0].preview).toBe(IMAGE.urls_by_size.medium);
      expect(component.files[0].id).toBe(IMAGE.id);
      expect(component.files[0].response).toEqual(IMAGE);
      expect(component.files[1].fileIndex).toBe(1);
      expect(component.files[1].preview).toBe(IMAGE.urls_by_size.medium);
      expect(component.files[1].id).toBe(IMAGE.id);
      expect(component.files[1].response).toEqual(IMAGE);
      expect(uploadService.setInitialImages).toHaveBeenCalledWith(component.files);
      expect(component.propagateChange).toHaveBeenCalledWith(component.files);
    }));
  });

  xdescribe('onUploadDone', () => {
    describe('with response 200', () => {
      describe('first image upload', () => {
        describe('with many images', () => {
          describe('normal item', () => {
            it('should set itemId and call uploadOtherImages', () => {
              const upload = {
                fileIndex: 0,
                file: new File(['file'], ''),
                id: UPLOAD_FILE_ID,
                name: UPLOAD_FILE_NAME,
                size: 123,
                type: 'image/jpeg',
                progress: {
                  status: UploadStatus.Queue,
                  data: {
                    percentage: 0,
                    speed: null,
                    speedHuman: null,
                    responseStatus: 200
                  }
                },
                lastModifiedDate: UPLOAD_FILE_DATE,
                preview: 'abcdef'
              };
              const uploadedFile = {
                ...upload,
                response: {
                  ...UPLOADED_RESPONSE,
                  id: ITEM_ID,
                  type: 'consumer_goods'
                }
              };
              component.files = [upload, upload];
              component.type = 'consumer_goods';
              spyOn(uploadService, 'uploadOtherImages');

              component['onUploadDone']({
                type: 'done',
                file: UPLOADED_FILE_FIRST_ITEM
              });

              expect(component['itemId']).toBe(ITEM_ID);
              expect(uploadService.uploadOtherImages).toHaveBeenCalledWith(ITEM_ID, component.type);
            });
          });

          describe('car item', () => {
            it('should set itemId, item and call uploadOtherImages', () => {
              component.files = [UPLOAD_FILE, UPLOAD_FILE];
              component.type = 'cars';
              component.maxUploads = 8;
              spyOn(uploadService, 'uploadOtherImages');

              component['onUploadDone']({
                type: 'done',
                file: UPLOADED_FILE_FIRST
              });
              expect(component['item']).toEqual(UPLOADED_FILE_FIRST.response);
              expect(component['itemId']).toBe(CAR_ID);
              expect(uploadService.uploadOtherImages).toHaveBeenCalledWith(CAR_ID, component.type);
            });
          });
        });

        describe('with only one image', () => {
          it('should set itemId and emit onUploaded event', () => {
            let event: UploadedEvent;
            component.files = [UPLOAD_FILE];
            component.onUploaded.subscribe((r: UploadedEvent) => {
              event = r;
            });

            component['onUploadDone']({
              type: 'done',
              file: UPLOADED_FILE_FIRST
            });

            expect(component['itemId']).toBe(CAR_ID);
            expect(event).toEqual( { action: 'created', response: UPLOADED_FILE_FIRST.response });
          });
          it('should set item with hold true flag and call createOnHold event', () => {
            let event: UploadedEvent;
            const fileOnHold: UploadFile = UPLOADED_FILE_FIRST;
            fileOnHold.response.flags['onhold'] = true;
            component.files = [UPLOAD_FILE];

            component.onUploaded.subscribe((r: UploadedEvent) => {
              event = r;
            });
            component['onUploadDone']({
              type: 'done',
              file: fileOnHold
            });

            expect(component['itemId']).toBe(CAR_ID);
            expect(component['item']).toEqual(UPLOADED_FILE_FIRST.response);
            expect(event).toEqual({ action: 'createdOnHold', response: UPLOADED_FILE_FIRST.response });
          });
        });
      });

      describe('other image upload', () => {
        it('should emit onUploaded event if every file has been uploaded', () => {
          let event: UploadedEvent;
          component.files = [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE, UPLOAD_FILE_DONE];
          component.onUploaded.subscribe((r: UploadedEvent) => {
            event = r;
          });
          component.item = UPLOAD_FILE_DONE.response;

          component['onUploadDone']({
            type: 'done',
            file: UPLOADED_FILE_OTHER
          });

          expect(event).toEqual( { action: 'created', response: UPLOADED_FILE_OTHER.response });
        });

        it('should NOT emit onUploaded event if not every file has been uploaded', () => {
          let response: UploadedEvent;
          component.files = [UPLOAD_FILE, UPLOAD_FILE, UPLOAD_FILE_DONE];
          component.onUploaded.subscribe((r: UploadedEvent) => {
            response = r;
          });

          component['onUploadDone']({
            type: 'done',
            file: UPLOADED_FILE_OTHER
          });

          expect(response).toBeUndefined();
        });

        it('should update files if picture has been uploaded on edit mode', () => {
          component.images = [IMAGE, IMAGE];
          component.files = [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE, UPLOAD_FILE_DONE];
          spyOn(component, 'propagateChange');
          spyOn(errorsService, 'i18nSuccess');

          component['onUploadDone']({
            type: 'done',
            file: UPLOADED_FILE_OTHER
          });

          expect(component.files.length).toBe(4);
          expect(component.propagateChange).toHaveBeenCalledWith(component.files);
          expect(errorsService.i18nSuccess).toHaveBeenCalledWith('imageUploaded');
        });
      });
    });

    describe('with error response', () => {
      it('should call i18nError', () => {
        const fileUploaded: UploadFile = <UploadFile>{...UPLOAD_FILE};
        let event: boolean;
        fileUploaded.progress.data.responseStatus = 400;
        fileUploaded.response = {
          message: 'error'
        };
        spyOn(errorsService, 'i18nError');
        component.onError.subscribe(() => {
          event = true;
        });

        component['onUploadDone']({
          type: 'done',
          file: fileUploaded
        });

        expect(errorsService.i18nError).toHaveBeenCalledWith('serverError', 'error');
        expect(event).toBeTruthy();
      });

      it('should call i18nError event if no error message', () => {
        let event: boolean;
        spyOn(errorsService, 'i18nError');
        component.onError.subscribe(() => {
          event = true;
        });

        component['onUploadDone']({
          type: 'done',
          file: UPLOAD_FILE
        });

        expect(errorsService.i18nError).toHaveBeenCalledWith('serverError');
        expect(event).toBeTruthy();
      });
    });
  });

  describe('remove', () => {
    it('should call removeImage', () => {
      spyOn(uploadService, 'removeImage');

      component.remove(UPLOAD_FILE, new Event(''));

      expect(uploadService.removeImage).toHaveBeenCalledWith(UPLOAD_FILE);
    });

    it('should open confirm dialog and then call deletePicture and removeImage if edit mode', fakeAsync(() => {
      spyOn(uploadService, 'removeImage');
      spyOn(modalService, 'open').and.callThrough();
      spyOn(itemService, 'deletePicture').and.callThrough();
      component.images = [IMAGE, IMAGE];
      component.itemId = ITEM_ID;

      component.remove(UPLOAD_FILE_DONE, new Event(''));
      tick();

      expect(modalService.open).toHaveBeenCalledWith(RemoveConfirmModalComponent);
      expect(itemService.deletePicture).toHaveBeenCalledWith(ITEM_ID, PICTURE_ID);
      expect(uploadService.removeImage).toHaveBeenCalledWith(UPLOAD_FILE_DONE);
    }));
  });

  describe('updateOrder', () => {
    it('should call removeImage', () => {
      spyOn(uploadService, 'updateOrder');
      component.files = [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE];

      component.updateOrder();

      expect(uploadService.updateOrder).toHaveBeenCalledWith(component.files);
    });

    it('should call updatePicturesOrder if edit mode', () => {
      spyOn(itemService, 'updatePicturesOrder').and.callThrough();
      component.files = [UPLOAD_FILE_DONE];
      component.images = [IMAGE, IMAGE];
      component.itemId = ITEM_ID;

      component.updateOrder();

      expect(itemService.updatePicturesOrder).toHaveBeenCalledWith(ITEM_ID, {
        [PICTURE_ID]: 0
      });
    });
  });
});
