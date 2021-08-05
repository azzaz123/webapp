import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  EditItemRE,
  ListItemRE,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ErrorsService } from '@core/errors/errors.service';
import { whitespaceValidator } from '@core/form-validators/formValidators.func';
import { ItemLocation } from '@core/geolocation/address-response.interface';
import { ITEM_TYPES } from '@core/item/item';
import { REALESTATE_CATEGORY } from '@core/item/item-categories';
import { RealestateContent, RealEstateResponse } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { Realestate } from '@core/item/realestate';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { OUTPUT_TYPE, PendingFiles, UploadFile, UploadOutput, UPLOAD_ACTION } from '@shared/uploader/upload.interface';
import { isEqual, omit } from 'lodash-es';
import { catchError, map, tap } from 'rxjs/operators';
import { Key } from '../../core/models/key.interface';
import { UploadEvent } from '../../core/models/upload-event.interface';
import { ItemReactivationService } from '../../core/services/item-reactivation/item-reactivation.service';
import { RealestateKeysService } from '../../core/services/realstate-keys/realestate-keys.service';
import { UploadService } from '../../core/services/upload/upload.service';
import { PreviewModalComponent } from '../../modals/preview-modal/preview-modal.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { forkJoin, Observable, of, Subscriber } from 'rxjs';
import { LocationSelectorModal } from '@shared/modals/location-selector-modal/location-selector-modal.component';

@Component({
  selector: 'tsl-upload-realestate',
  templateUrl: './upload-realestate.component.html',
  styleUrls: ['./upload-realestate.component.scss'],
})
export class UploadRealestateComponent implements OnInit {
  @Output() validationError: EventEmitter<any> = new EventEmitter();
  @Output() formChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  @Input() item: Realestate;
  @Input() isReactivation = false;
  public coordinates: ItemLocation;

  public uploadForm: FormGroup;
  public loading = false;
  public uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();

  public operations: Key[];
  public types: Key[];
  public extras: Key[];
  public conditions: IOption[];
  public currencies: IOption[] = [
    { value: 'EUR', label: '€' },
    { value: 'GBP', label: '£' },
  ];
  public uploadCompletedPercentage = 0;
  public pendingFiles: PendingFiles;

  private oldFormValue: any;

  constructor(
    private fb: FormBuilder,
    private realestateKeysService: RealestateKeysService,
    private router: Router,
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private itemService: ItemService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    private uploadService: UploadService,
    private itemReactivationService: ItemReactivationService,
    config: NgbPopoverConfig
  ) {
    this.uploadForm = fb.group({
      id: '',
      category_id: REALESTATE_CATEGORY,
      images: [[], [Validators.required]],
      title: ['', [Validators.required]],
      sale_price: ['', [Validators.required, Validators.min(0), Validators.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      storytelling: ['', [Validators.required, whitespaceValidator]],
      operation: ['', [Validators.required]],
      type: ['', [Validators.required]],
      condition: ['', [Validators.required]],
      surface: '',
      rooms: '',
      bathrooms: '',
      garage: false,
      terrace: false,
      elevator: false,
      pool: false,
      garden: false,
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
        approximated_location: false,
      }),
    });
    config.placement = 'right';
    config.triggers = 'focus:blur';
    config.container = 'body';
  }

  ngOnInit() {
    this.getOptions().subscribe(() => {
      if (this.item && this.isReactivation) {
        this.itemReactivationService.reactivationValidation(this.uploadForm);
      }
    });

    if (this.item) {
      this.uploadForm.patchValue({
        id: this.item.id,
        title: this.item.title,
        sale_price: this.item.salePrice,
        currency_code: this.item.currencyCode,
        storytelling: this.item.description,
        category_id: this.item.categoryId.toString(),
        operation: this.item.operation,
        type: this.item.type,
        condition: this.item.condition,
        surface: this.item.surface,
        rooms: this.item.rooms,
        bathrooms: this.item.bathrooms,
        garage: this.item.garage,
        terrace: this.item.terrace,
        elevator: this.item.elevator,
        pool: this.item.pool,
        garden: this.item.garden,
        location: this.item.location,
        images: this.uploadService.convertImagesToFiles(this.item.images),
      });
      this.coordinates = {
        latitude: this.item.location.latitude,
        longitude: this.item.location.longitude,
        address: this.item.location.address,
        approximated_location: this.item.location.approximated_location,
      };
      this.detectFormChanges();
    }
  }

  public emitLocation(): void {
    this.coordinates = this.uploadForm.value.location;
    if (this.item) {
      this.updateLocation();
    }
    this.locationSelected.emit(13000);
  }

  public onSubmit(): void {
    if (this.uploadForm.valid) {
      this.checkUserLocation().subscribe((readyToSave: boolean) => {
        if (readyToSave) {
          this.saveItem();
        }
      });
    } else {
      this.invalidForm();
    }
  }

  public onUploaded(response: RealestateContent, action: UPLOAD_ACTION) {
    this.formChanged.emit(false);
    if (response.flags.onhold) {
      action = UPLOAD_ACTION.createdOnHold;
    }

    const params: any = {
      [action]: true,
      itemId: response.id,
    };
    if (this.item && this.item.flags.onhold) {
      params.onHold = true;
    }

    this.trackEditOrUpload(!!this.item, response);
    this.router.navigate(['/catalog/list', params]);
  }

  public onError(error: HttpErrorResponse | any): void {
    this.loading = false;
    this.errorsService.i18nError(TRANSLATION_KEY.SERVER_ERROR, error.message ? error.message : '');
  }

  public hasErrorToShow(controlName: string): boolean {
    const control: AbstractControl = this.uploadForm.get(controlName);
    return control.invalid && control.touched;
  }

  public preview() {
    const modalRef: NgbModalRef = this.modalService.open(PreviewModalComponent, {
      windowClass: 'preview',
    });
    modalRef.componentInstance.itemPreview = this.uploadForm.value;
    modalRef.result.then(
      () => {
        this.onSubmit();
      },
      () => {}
    );
  }

  public updateUploadPercentage(percentage: number) {
    this.uploadCompletedPercentage = Math.round(percentage);
  }

  public onDeleteImage(imageId: string): void {
    this.uploadService.onDeleteImage(this.item.id, imageId).subscribe(
      () => this.removeFileFromForm(imageId),
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  public onOrderImages(): void {
    const images = this.uploadForm.get('images').value;
    this.uploadService.updateOrder(images, this.item.id).subscribe(
      () => null,
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  public onAddImage(file: UploadFile): void {
    if (this.item) {
      this.uploadService.uploadSingleImage(file, this.item.id, ITEM_TYPES.REAL_ESTATE).subscribe(
        (value: UploadOutput) => {
          if (value.type === OUTPUT_TYPE.done) {
            this.errorsService.i18nSuccess(TRANSLATION_KEY.IMAGE_UPLOADED);
            file.id = value.file.response;
          }
        },
        (error: HttpErrorResponse) => {
          this.removeFileFromForm(file.id);
          this.onError(error);
        }
      );
    }
  }

  private getOptions(): Observable<void> {
    this.getTypes('rent');
    this.uploadForm.get('operation').valueChanges.subscribe((operation: string) => this.getTypes(operation));
    this.uploadForm.get('type').valueChanges.subscribe((type: string) => this.getExtras(type));

    const operations$ = this.realestateKeysService.getOperations().pipe(catchError(this.handleOptionsError));
    const conditions$ = this.realestateKeysService.getConditions().pipe(catchError(this.handleOptionsError));

    return forkJoin({
      operations$,
      conditions$,
    }).pipe(
      map(({ operations$, conditions$ }) => {
        this.operations = operations$;
        this.conditions = conditions$;
      })
    );
  }

  private handleOptionsError = () => {
    return of([]);
  };

  private updateLocation() {
    this.itemService.updateRealEstateLocation(this.item.id, this.coordinates).subscribe();
  }

  private getTypes(operation: string) {
    this.realestateKeysService.getTypes(operation).subscribe((types: Key[]) => {
      this.types = types;
    });
    this.uploadForm.get('type').setValue('');
  }

  private getExtras(type: string) {
    this.realestateKeysService.getExtras(type).subscribe((extras: Key[]) => {
      this.extras = extras;
    });
    this.uploadForm.get('garage').setValue(false);
    this.uploadForm.get('terrace').setValue(false);
    this.uploadForm.get('elevator').setValue(false);
    this.uploadForm.get('pool').setValue(false);
    this.uploadForm.get('garden').setValue(false);
    this.uploadForm.get('rooms').setValue('');
    this.uploadForm.get('bathrooms').setValue('');
  }

  private detectFormChanges() {
    this.uploadForm.valueChanges.subscribe((value) => {
      if (this.operations && this.conditions && this.extras) {
        const oldItemData = omit(this.oldFormValue, ['images']);
        const newItemData = omit(value, ['images']);
        if (!this.oldFormValue) {
          this.oldFormValue = value;
        } else {
          if (!isEqual(oldItemData, newItemData)) {
            this.formChanged.emit(true);
          }
        }
        this.oldFormValue = value;
      }
    });
  }

  private saveItem(): void {
    this.loading = true;
    this.item ? this.updateItem() : this.createItem();
  }

  private invalidForm(): void {
    this.uploadForm.markAsPending();
    this.uploadForm.markAllAsTouched();
    if (!this.uploadForm.get('location.address').valid) {
      this.uploadForm.get('location.address').markAsDirty();
    }
    if (!this.uploadForm.get('images').valid) {
      this.errorsService.i18nError(TRANSLATION_KEY.MISSING_IMAGE_ERROR);
    } else {
      this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR, '', TRANSLATION_KEY.FORM_FIELD_ERROR_TITLE);
      this.validationError.emit();
    }
  }

  private checkUserLocation(): Observable<boolean> {
    if (!this.userService.user.location) {
      return new Observable((observer: Subscriber<boolean>) => {
        this.modalService
          .open(LocationSelectorModal)
          .result.then((locationUpdated: boolean) => {
            return observer.next(locationUpdated);
          })
          .catch(() => observer.next(false))
          .finally(() => observer.complete());
      });
    } else {
      return of(true);
    }
  }

  private createItem(): void {
    this.uploadService.createItem(this.uploadForm.value, ITEM_TYPES.REAL_ESTATE).subscribe(
      (response: UploadOutput) => {
        this.updateUploadPercentage(response.percentage);
        if (response.pendingFiles) {
          this.pendingFiles = response.pendingFiles;
        }
        if (response.type === OUTPUT_TYPE.done) {
          this.onUploaded(response.file.response.content, UPLOAD_ACTION.created);
        }
      },
      (error: HttpErrorResponse) => {
        this.onError(error);
      }
    );
  }

  private updateItem(): void {
    this.uploadService.updateItem(this.uploadForm.value, ITEM_TYPES.REAL_ESTATE).subscribe(
      (response: RealEstateResponse) => {
        this.onUploaded(response.content, UPLOAD_ACTION.updated);
      },
      (error: HttpErrorResponse) => {
        this.onError(error);
      }
    );
  }

  private trackEditOrUpload(isEdit: boolean, item: RealestateContent) {
    const isPro = this.userService.isProUser();
    const baseEventAttrs: any = {
      itemId: item.id,
      categoryId: item.category_id,
      salePrice: item.sale_price,
      title: item.title,
      operation: item.operation,
      type: item.type,
      condition: item.condition,
      surface: item.surface || null,
      rooms: item.rooms || null,
      isPro,
    };

    if (isEdit) {
      const editItemREEvent: AnalyticsEvent<EditItemRE> = {
        name: ANALYTICS_EVENT_NAMES.EditItemRE,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          ...baseEventAttrs,
          screenId: SCREEN_IDS.EditItem,
        },
      };
      this.analyticsService.trackEvent(editItemREEvent);
    } else {
      const listItemREEvent: AnalyticsEvent<ListItemRE> = {
        name: ANALYTICS_EVENT_NAMES.ListItemRE,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          ...baseEventAttrs,
          screenId: SCREEN_IDS.Upload,
          country: this.analyticsService.market,
          language: this.analyticsService.appLocale,
        },
      };
      this.analyticsService.trackEvent(listItemREEvent);
    }
  }

  private removeFileFromForm(imageId: string): void {
    const imagesControl: FormControl = this.uploadForm.get('images') as FormControl;
    const images: UploadFile[] = imagesControl.value;
    imagesControl.patchValue(images.filter((image) => image.id !== imageId));
  }
}
