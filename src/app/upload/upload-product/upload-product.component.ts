import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  AfterContentInit
} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import { isPresent } from 'ng2-dnd/src/dnd.utils';
import * as _ from 'lodash';
import { NgbModal, NgbModalRef, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategoryOption } from '../../core/category/category-response.interface';
import { UploadEvent } from '../upload-event.interface';
import { CategoryService } from '../../core/category/category.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { Item, ITEM_TYPES } from '../../core/item/item';
import { DeliveryInfo } from '../../core/item/item-response.interface';

@Component({
  selector: 'tsl-upload-product',
  templateUrl: './upload-product.component.html',
  styleUrls: ['./upload-product.component.scss']
})
export class UploadProductComponent implements OnInit, AfterContentInit, OnChanges {

  @Input() categoryId: string;
  @Input() item: Item;
  @Input() urgentPrice: number;
  @Output() onValidationError: EventEmitter<any> = new EventEmitter();
  @Output() onFormChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() onCategorySelect = new EventEmitter<number>();
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  public itemTypes: any = ITEM_TYPES;

  public uploadForm: FormGroup;
  public currencies: IOption[] = [
    {value: 'EUR', label: '€'},
    {value: 'GBP', label: '£'}
  ];
  public deliveryInfo: any = [{
    size: '20x38x40cm',
    value: {
      min_weight_kg: 0,
      max_weight_kg: 5
    }
  }, {
    size: '30x40x50cm',
    value: {
      min_weight_kg: 5,
      max_weight_kg: 10
    }
  }, {
    size: '40x50x60cm',
    value: {
      min_weight_kg: 10,
      max_weight_kg: 20
    }
  }, {
    size: '50x60x60cm',
    value: {
      min_weight_kg: 20,
      max_weight_kg: 30
    }
  }];
  public categories: CategoryOption[] = [];
  public loading: boolean;
  public fixedCategory: string;
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  @ViewChild('title') titleField: ElementRef;
  private focused: boolean;
  private oldFormValue: any;
  public isUrgent = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private errorsService: ErrorsService,
              private categoryService: CategoryService,
              private modalService: NgbModal,
              private trackingService: TrackingService,
              config: NgbPopoverConfig) {
    this.uploadForm = fb.group({
      id: '',
      category_id: ['', [Validators.required]],
      images: [[], [Validators.required]],
      title: ['', [Validators.required]],
      sale_price: ['', [Validators.required, this.min(0), this.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      description: ['', [Validators.required]],
      sale_conditions: fb.group({
        fix_price: false,
        exchange_allowed: false
      }),
      delivery_info: [null],
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      })
    });
    config.placement = 'right';
    config.triggers = 'focus:blur';
    config.container = 'body';
  }

  ngOnInit() {
    if (this.item) {
      this.uploadForm.patchValue({
        id: this.item.id,
        title: this.item.title,
        sale_price: this.item.salePrice,
        currency_code: this.item.currencyCode,
        description: this.item.description,
        sale_conditions: this.item.saleConditions,
        category_id: this.item.categoryId.toString(),
        delivery_info: this.getDeliveryInfo()
      });
      this.detectFormChanges();
    }
  }

  private detectFormChanges() {
    this.uploadForm.valueChanges.subscribe((value) => {
      const oldItemData = _.omit(this.oldFormValue, ['images', 'location']);
      const newItemData = _.omit(value, ['images', 'location']);
      if (!this.oldFormValue) {
        this.oldFormValue = value;
      } else {
        if (!_.isEqual(oldItemData, newItemData)) {
          this.onFormChanged.emit(true);
        }
        this.oldFormValue = value;
      }
    });
  }

  private getDeliveryInfo(): DeliveryInfo {
    if (!this.item.deliveryInfo) {
      return null;
    }
    return this.deliveryInfo.find((deliveryInfo) => {
      return deliveryInfo.value.max_weight_kg === this.item.deliveryInfo.max_weight_kg;
    }).value;
  }

  ngOnChanges(changes?: any) {
    this.categoryService.getUploadCategories().subscribe((categories: CategoryOption[]) => {
      this.categories = categories.filter((category: CategoryOption) => {
        return !this.categoryService.isHeroCategory(+category.value);
      });
      if (!this.item) {
        if (this.categoryId && this.categoryId !== '-1') {
          this.uploadForm.get('category_id').patchValue(this.categoryId);
          const fixedCategory = _.find(categories, {value: this.categoryId});
          this.fixedCategory = fixedCategory ? fixedCategory.label : null;
          this.uploadForm.get('delivery_info').patchValue(null);
        } else {
          this.fixedCategory = null;
        }
      } else {
        if (this.categoryService.isHeroCategory(this.item.categoryId)) {
          const fixedCategory = _.find(categories, {value: this.item.categoryId.toString()});
          this.fixedCategory = fixedCategory ? fixedCategory.label : null;
        }
      }
    });
  }

  ngAfterContentInit() {
    if (!this.item && this.titleField && !this.focused) {
      this.titleField.nativeElement.focus();
      this.focused = true;
    }
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      if (this.item && this.item.itemType === this.itemTypes.CONSUMER_GOODS) {
        this.uploadForm.value.sale_conditions.shipping_allowed = true;
      }
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
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_SUCCESS, {category: this.uploadForm.value.category_id});
      appboy.logCustomEvent('Edit', {platform: 'web'});
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_UPLOADFROMFORM);
      appboy.logCustomEvent('List', {platform: 'web'});
    }

    if (this.isUrgent) {
      this.trackingService.track(TrackingService.UPLOADFORM_CHECKBOX_URGENT, {category: this.uploadForm.value.category_id});
      uploadEvent.action = 'urgent';
      localStorage.setItem('transactionType', 'urgent');
    }
    this.router.navigate(['/catalog/list', {[uploadEvent.action]: true, itemId: uploadEvent.response.id}]);
  }

  onError(response: any) {
    this.loading = false;
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_ERROR, {category: this.uploadForm.value.category_id});
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_ERROR);
    }
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

  private min(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (isPresent(Validators.required(control))) {
        return null;
      }
      const v: number = Number(control.value);
      return v < min ? {'min': {'requiredMin': min, 'actualMin': v}} : null;
    };
  }

  private max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (isPresent(Validators.required(control))) {
        return null;
      }
      const v: number = Number(control.value);
      return v > max ? {'max': {'requiredMax': max, 'actualMax': v}} : null;
    };
  }

  public selectUrgent(isUrgent: boolean): void {
    this.isUrgent = isUrgent;
  }

  public setCategory(value: number): void {
    this.onCategorySelect.emit(value);
  }

  public emitLocation(): void {
    this.locationSelected.emit(this.categoryId);
  }

}

