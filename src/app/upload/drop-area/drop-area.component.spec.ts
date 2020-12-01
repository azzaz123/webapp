import { throwError, of } from 'rxjs';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { DropAreaComponent } from './drop-area.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UploadService } from './upload.service';
import {
  CAR_ID,
  UPLOAD_FILE,
  UPLOAD_FILE_DATE,
  UPLOAD_FILE_DONE,
  UPLOAD_FILE_ID,
  UPLOAD_FILE_NAME,
  UPLOADED_FILE_FIRST,
  UPLOADED_FILE_FIRST_ITEM,
  UPLOADED_FILE_OTHER,
  UPLOADED_RESPONSE,
  UPLOAD_FILE_2,
} from '../../../tests/upload.fixtures.spec';
import { ItemService } from '../../core/item/item.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RemoveConfirmModalComponent } from './remove-confirm-modal/remove-confirm-modal.component';
import { ITEM_ID, PICTURE_ID } from '../../../tests/item.fixtures.spec';
import { ErrorsService } from '../../core/errors/errors.service';
import { IMAGE } from '../../../tests/user.fixtures.spec';
import { UploadedEvent } from '../upload-event.interface';
import { ITEM_TYPES } from '../../core/item/item';
import {
  UploadFile,
  UploadStatus,
} from '../../shared/uploader/upload.interface';
import { UploaderService } from 'app/shared/uploader/uploader.service';
import { FileDropActions } from 'app/shared/uploader/file-drop.directive';

describe('DropAreaComponent', () => {
  let component: DropAreaComponent;
  let fixture: ComponentFixture<DropAreaComponent>;
  let uploaderService: UploaderService;
  let errorsService: ErrorsService;
  let modalService: NgbModal;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DropAreaComponent],
        providers: [
          {
            provide: ErrorsService,
            useValue: {
              i18nError() {},
              i18nSuccess() {},
            },
          },
          {
            provide: UploaderService,
            useValue: {
              serviceEvents: of(null),
            },
          },
          {
            provide: NgbModal,
            useValue: {
              open() {
                return {
                  result: Promise.resolve(),
                };
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DropAreaComponent);
    component = fixture.componentInstance;
    uploaderService = TestBed.inject(UploaderService);
    errorsService = TestBed.inject(ErrorsService);
    modalService = TestBed.inject(NgbModal);
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
  });

  describe('registerOnChange', () => {
    it('should set propagateChange', () => {
      const FUNC: Function = () => {};

      component.registerOnChange(FUNC);

      expect(component.propagateChange).toBe(FUNC);
    });
  });

  describe('onUploadOutput', () => {
    it('should add file if event addedToQueue', () => {
      spyOn(component, 'propagateChange');

      component.onUploadOutput({
        type: 'addedToQueue',
        file: UPLOAD_FILE,
      });

      expect(component.files[0]).toEqual(UPLOAD_FILE);
      expect(component.propagateChange).toHaveBeenCalledWith(component.files);
      component.onUploadOutput({
        type: 'addedToQueue',
        file: UPLOADED_FILE_OTHER,
      });
      expect(component.files.length).toEqual(2);
    });

    it('should upload file if event addedToQueue and edit mode', () => {
      component.files = [UPLOAD_FILE, UPLOAD_FILE];
      spyOn(component.onAddImage, 'emit');

      component.onUploadOutput({
        type: 'addedToQueue',
        file: UPLOAD_FILE,
      });

      expect(component.onAddImage.emit).toHaveBeenCalledWith(UPLOAD_FILE);

      expect(component.files).toEqual([UPLOAD_FILE, UPLOAD_FILE, UPLOAD_FILE]);
    });

    describe('if event is uploading', () => {
      it('should update file', () => {
        const fileUploaded: UploadFile = <UploadFile>{ ...UPLOAD_FILE };
        fileUploaded.progress.data.percentage = 100;
        component.files = [UPLOAD_FILE];

        component.onUploadOutput({
          type: 'uploading',
          file: fileUploaded,
        });

        expect(component.files[0].progress.data.percentage).toBe(100);
      });
    });

    it('should set dragOver if event dragOver', () => {
      component.onFileDropAction({ action: FileDropActions.DRAGOVER });

      expect(component.dragOver).toBeTruthy();
    });

    it('should set dragOver if event dragOut', () => {
      component.onFileDropAction({ action: FileDropActions.DRAGOUT });

      expect(component.dragOver).toBeFalsy();
    });

    it('should set dragOver if event drop', () => {
      component.onFileDropAction({ action: FileDropActions.DROP });

      expect(component.dragOver).toBeFalsy();
    });

    it('should call errorsService if event rejected', () => {
      spyOn(errorsService, 'i18nError');

      component.onUploadOutput({
        type: 'rejected',
        file: UPLOAD_FILE,
        reason: 'reason',
      });

      expect(errorsService.i18nError).toHaveBeenCalledWith(
        'reason',
        UPLOAD_FILE_NAME
      );
    });
  });

  describe('remove', () => {
    it('should remove item', () => {
      spyOn(component, 'propagateChange');
      component.files = [UPLOAD_FILE, UPLOAD_FILE_2];

      component.remove(UPLOAD_FILE, new Event(''));

      expect(component.files).toEqual([UPLOAD_FILE_2]);
      expect(component.propagateChange).toHaveBeenCalledWith(component.files);
    });

    it('should open confirm dialog and then call deletePicture and removeImage if edit mode', fakeAsync(() => {
      spyOn(component, 'propagateChange');
      spyOn(component.onDeleteImage, 'emit');
      spyOn(modalService, 'open').and.callThrough();
      component.isUpdatingItem = true;

      component.remove(UPLOAD_FILE_DONE, new Event(''));
      tick();

      expect(modalService.open).toHaveBeenCalledWith(
        RemoveConfirmModalComponent
      );
      expect(component.onDeleteImage.emit).toHaveBeenCalledWith(PICTURE_ID);
    }));
  });

  describe('updateOrder', () => {
    it('should call removeImage', () => {
      spyOn(component.onOrderImages, 'emit');
      component.files = [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE];

      component.updateOrder();

      expect(component.onOrderImages.emit).toHaveBeenCalled();
    });
  });
});
