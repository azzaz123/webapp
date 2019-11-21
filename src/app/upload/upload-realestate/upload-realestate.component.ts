import { ListItemRE } from '../../core/analytics/resources/events-interfaces/list-item-re.interface';
import { EditItemRE } from '../../core/analytics/resources/events-interfaces/edit-item-re.interface';
import { ANALYTIC_EVENT_TYPES } from '../../core/analytics/analytics-constants';
import { SCREEN_IDS } from '../../core/analytics/resources/analytics-screen-ids';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IOption } from 'ng-select';
import { RealestateKeysService } from './realestate-keys.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Key } from './key.interface';
import { UploadEvent } from '../upload-event.interface';
import { TrackingService } from '../../core/tracking/tracking.service';
import { Router } from '@angular/router';
import { ErrorsService } from '../../core/errors/errors.service';
import { Coordinate, ItemLocation } from '../../core/geolocation/address-response.interface';
import { Item } from '../../core/item/item';
import { omit, isEqual } from 'lodash-es';
import { NgbModal, NgbModalRef, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { ItemService } from '../../core/item/item.service';
import { Realestate } from '../../core/item/realestate';
import { REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { UserService } from '../../core/user/user.service';
import { ANALYTICS_EVENT_NAMES } from '../../core/analytics/resources/analytics-event-names';
import { RealestateContent } from '../../core/item/item-response.interface';

@Component({
  selector: 'tsl-upload-realestate',
  templateUrl: './upload-realestate.component.html',
  styleUrls: ['./upload-realestate.component.scss']
})
export class UploadRealestateComponent implements OnInit {

  @Output() onValidationError: EventEmitter<any> = new EventEmitter();
  @Output() onFormChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  @Input() item: Realestate;
  @Input() urgentPrice: number;
  public coordinates: ItemLocation;

  public uploadForm: FormGroup;
  public loading: boolean;
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  public isUrgent = false;
  private oldFormValue: any;

  public operations: Key[];
  public types: Key[];
  public extras: Key[];
  public conditions: IOption[];
  public currencies: IOption[] = [
    { value: 'EUR', label: '€' },
    { value: 'GBP', label: '£' }
  ];

  constructor(private fb: FormBuilder,
    private realestateKeysService: RealestateKeysService,
    private router: Router,
    private errorsService: ErrorsService,
    private modalService: NgbModal,
    private itemService: ItemService,
    private trackingService: TrackingService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    config: NgbPopoverConfig) {
    this.uploadForm = fb.group({
      id: '',
      category_id: REALESTATE_CATEGORY,
      images: [[], [Validators.required]],
      title: ['', [Validators.required]],
      sale_price: ['', [Validators.required, Validators.min(0), Validators.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      storytelling: '',
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
        approximated_location: false
      })
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
        location: this.item.location
      });
      this.coordinates = {
        latitude: this.item.location.latitude,
        longitude: this.item.location.longitude,
        address: this.item.location.address,
        approximated_location: this.item.location.approximated_location
      };
      this.detectFormChanges();
    }
  }

  private getOptions() {
    this.realestateKeysService.getOperations().subscribe((operations: Key[]) => {
      this.operations = operations;
    });
    this.realestateKeysService.getConditions().subscribe((conditions: IOption[]) => {
      this.conditions = conditions;
    });
    this.getTypes('rent');
    this.uploadForm.get('operation').valueChanges.subscribe((operation: string) => this.getTypes(operation));
    this.uploadForm.get('type').valueChanges.subscribe((type: string) => this.getExtras(type));
  }

  public emitLocation(): void {
    this.coordinates = this.uploadForm.value.location;
    if (this.item) {
      this.updateLocation();
    }
    this.locationSelected.emit(13000);
  }

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
            this.onFormChanged.emit(true);
          }
        }
        this.oldFormValue = value;
      }
    });
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.uploadEvent.emit({
        type: this.item ? 'update' : 'create',
        values: this.uploadForm.value
      });
    } else {
      for (const control in this.uploadForm.controls) {
        if (this.uploadForm.controls.hasOwnProperty(control) && !this.uploadForm.controls[control].valid) {
          this.uploadForm.controls[control].markAsDirty();
        }
      }
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
  }

  onUploaded(uploadEvent: any) {
    this.onFormChanged.emit(false);
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_SUCCESS, { category: this.uploadForm.value.category_id });
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_UPLOADFROMFORM);
    }
    if (this.isUrgent) {
      this.trackingService.track(TrackingService.UPLOADFORM_CHECKBOX_URGENT, { category: this.uploadForm.value.category_id });
      uploadEvent.action = 'urgent';
      localStorage.setItem('transactionType', 'urgent');
    }
    const params: any = {
      [uploadEvent.action]: true,
      itemId: uploadEvent.response.id
    };
    if (this.item && this.item.flags.onhold) {
      params.onHold = true;
    }
    
    this.item ? this.trackEditOrUpload(true, uploadEvent.response.content) : this.trackEditOrUpload(false, uploadEvent.response.content);

    this.router.navigate(['/catalog/list', params]);
  }

  onError(response: any) {
    this.loading = false;
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_ERROR, { category: this.uploadForm.value.category_id });
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_ERROR);
    }
  }

  public selectUrgent(isUrgent: boolean): void {
    this.isUrgent = isUrgent;
  }

  preview() {
    const modalRef: NgbModalRef = this.modalService.open(PreviewModalComponent, {
      windowClass: 'preview'
    });
    modalRef.componentInstance.itemPreview = this.uploadForm.value;
    modalRef.result.then(() => {
      this.onSubmit();
    }, () => {
    });
  }

  private trackEditOrUpload(isEdit: boolean, item: RealestateContent) {
    this.userService.isProUser().subscribe((isProfessional: boolean) => {
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
        isPro: isProfessional
      };

      if (isEdit) {
        const eventAttrs: EditItemRE = {
          ...baseEventAttrs,
          screenId: SCREEN_IDS.EditItem
        }

        this.analyticsService.trackEvent({
          name: ANALYTICS_EVENT_NAMES.EditItemRE,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: eventAttrs
        });
      } else {
        const eventAttrs: ListItemRE = {
          ...baseEventAttrs,
          screenId: SCREEN_IDS.Upload
        }

        this.analyticsService.trackEvent({
          name: ANALYTICS_EVENT_NAMES.ListItemRE,
          eventType: ANALYTIC_EVENT_TYPES.Other,
          attributes: eventAttrs
        });
      }
    });
  }

}
