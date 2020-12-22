import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import {
  RealestateContent,
  RealEstateResponse,
} from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { Realestate } from '@core/item/realestate';
import { TrackingService } from '@core/tracking/tracking.service';
import { UserService } from '@core/user/user.service';
import {
  NgbModal,
  NgbModalRef,
  NgbPopoverConfig,
} from '@ng-bootstrap/ng-bootstrap';
import {
  OUTPUT_TYPE,
  PendingFiles,
  UPLOAD_ACTION,
  UploadFile,
  UploadOutput,
} from '@shared/uploader/upload.interface';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { isEqual, omit } from 'lodash-es';
import { tap } from 'rxjs/operators';
import { UploadService } from '../drop-area/upload.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { UploadEvent } from '../upload-event.interface';
import { Key } from './key.interface';
import { RealestateKeysService } from './realestate-keys.service';

@Component({
  selector: 'tsl-upload-realestate',
  templateUrl: './upload-realestate.component.html',
  styleUrls: ['./upload-realestate.component.scss'],
})
export class UploadRealestateComponent implements OnInit {
  @Output() onValidationError: EventEmitter<any> = new EventEmitter();
  @Output() onFormChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  @Input() item: Realestate;
  public coordinates: ItemLocation;

  public uploadForm: FormGroup;
  public loading: boolean;
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  private oldFormValue: any;

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

  constructor(
    private fb: FormBuilder,
    private realestateKeysService: RealestateKeysService,
    private router: Router,
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private itemService: ItemService,
    private trackingService: TrackingService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    private uploadService: UploadService,
    config: NgbPopoverConfig
  ) {
    this.uploadForm = fb.group({
      id: '',
      category_id: REALESTATE_CATEGORY,
      images: [[], [Validators.required]],
      title: ['', [Validators.required]],
      sale_price: [
        '',
        [Validators.required, Validators.min(0), Validators.max(999999999)],
      ],
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
    this.getOptions();
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

  private getOptions() {
    this.realestateKeysService
      .getOperations()
      .subscribe((operations: Key[]) => {
        this.operations = operations;
      });
    this.realestateKeysService
      .getConditions()
      .subscribe((conditions: IOption[]) => {
        this.conditions = conditions;
      });
    this.getTypes('rent');
    this.uploadForm
      .get('operation')
      .valueChanges.subscribe((operation: string) => this.getTypes(operation));
    this.uploadForm
      .get('type')
      .valueChanges.subscribe((type: string) => this.getExtras(type));
  }

  public emitLocation(): void {
    this.coordinates = this.uploadForm.value.location;
    if (this.item) {
      this.updateLocation();
    }
    this.locationSelected.emit(13000);
  }

  private updateLocation() {
    this.itemService
      .updateRealEstateLocation(this.item.id, this.coordinates)
      .subscribe();
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
            this.onFormChanged.emit(true);
          }
        }
        this.oldFormValue = value;
      }
    });
  }

  public onSubmit(): void {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.item ? this.updateItem() : this.createItem();
    } else {
      this.invalidForm();
    }
  }

  private invalidForm(): void {
    this.uploadForm.markAsPending();
    this.uploadForm.markAllAsTouched();
    if (!this.uploadForm.get('location.address').valid) {
      this.uploadForm.get('location.address').markAsDirty();
    }
    if (!this.uploadForm.get('images').valid) {
      this.errorsService.i18nError('missingImageError');
    } else {
      this.errorsService.i18nError('formErrors', '', 'formErrorsTitle');
      this.onValidationError.emit();
    }
  }

  private createItem(): void {
    this.uploadService
      .createItem(this.uploadForm.value, ITEM_TYPES.REAL_ESTATE)
      .subscribe(
        (response: UploadOutput) => {
          this.updateUploadPercentage(response.percentage);
          if (response.pendingFiles) {
            this.pendingFiles = response.pendingFiles;
          }
          if (response.type === OUTPUT_TYPE.done) {
            this.onUploaded(response.file.response, UPLOAD_ACTION.created);
          }
        },
        (error: HttpErrorResponse) => {
          this.onError(error);
        }
      );
  }

  private updateItem(): void {
    this.uploadService
      .updateItem(this.uploadForm.value, ITEM_TYPES.REAL_ESTATE)
      .subscribe(
        (response: RealEstateResponse) => {
          this.onUploaded(response.content, UPLOAD_ACTION.updated);
        },
        (error: HttpErrorResponse) => {
          this.onError(error);
        }
      );
  }

  onUploaded(response: RealestateContent, action: UPLOAD_ACTION) {
    this.onFormChanged.emit(false);

    if (this.item) {
      this.trackingService.track(
        TrackingService.MYITEMDETAIL_EDITITEM_SUCCESS,
        { category: this.uploadForm.value.category_id }
      );
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_UPLOADFROMFORM);
    }
    const params: any = {
      [action]: true,
      itemId: response.id,
    };
    if (this.item && this.item.flags.onhold) {
      params.onHold = true;
    }

    this.trackEditOrUpload(!!this.item, response).subscribe(() =>
      this.router.navigate(['/catalog/list', params])
    );
  }

  onError(error: HttpErrorResponse | any): void {
    this.loading = false;
    this.errorsService.i18nError(
      'serverError',
      error.message ? error.message : ''
    );
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_ERROR, {
        category: this.uploadForm.value.category_id,
      });
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_ERROR);
    }
  }

  hasErrorToShow(controlName: string): boolean {
    const control: AbstractControl = this.uploadForm.get(controlName);
    return control.invalid && control.touched;
  }

  preview() {
    const modalRef: NgbModalRef = this.modalService.open(
      PreviewModalComponent,
      {
        windowClass: 'preview',
      }
    );
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

  private trackEditOrUpload(isEdit: boolean, item: RealestateContent) {
    return this.userService.isProUser().pipe(
      tap((isProfessional: boolean) => {
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
          isPro: isProfessional,
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
            },
          };
          this.analyticsService.trackEvent(listItemREEvent);
        }
      })
    );
  }

  public onDeleteImage(imageId: string): void {
    this.uploadService.onDeleteImage(this.item.id, imageId).subscribe(
      () => this.removeFileFromForm(imageId),
      (error: HttpErrorResponse) => this.onError(error)
    );
  }

  private removeFileFromForm(imageId: string): void {
    const imagesControl: FormControl = this.uploadForm.get(
      'images'
    ) as FormControl;
    const images: UploadFile[] = imagesControl.value;
    imagesControl.patchValue(images.filter((image) => image.id !== imageId));
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
      this.uploadService
        .uploadSingleImage(file, this.item.id, ITEM_TYPES.REAL_ESTATE)
        .subscribe(
          (value: UploadOutput) => {
            if (value.type === OUTPUT_TYPE.done) {
              this.errorsService.i18nSuccess('imageUploaded');
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
}
