import { ListItemCG } from './../../core/analytics/events-interfaces/list-item-cg.interface';
import { EditItemCG } from './../../core/analytics/events-interfaces/edit-item-cg.interface';
import { EVENT_TYPES, SCREENS_IDS } from '../../core/analytics/resources/analytics-constants';
import { AnalyticsService } from './../../core/analytics/analytics.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterContentInit,
  OnChanges,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import { find, omit, isEqual } from 'lodash-es';
import { NgbModal, NgbModalRef, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategoryOption } from '../../core/category/category-response.interface';
import { UploadEvent } from '../upload-event.interface';
import { CategoryService } from '../../core/category/category.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { Item, ITEM_TYPES } from '../../core/item/item';
import { DeliveryInfo, ItemContent } from '../../core/item/item-response.interface';
import { GeneralSuggestionsService } from './general-suggestions.service';
import { KeywordSuggestion } from '../../shared/keyword-suggester/keyword-suggestion.interface';
import { Subject } from 'rxjs';
import { Brand, BrandModel, Model } from '../brand-model.interface';
import { SplitTestService } from '../../core/tracking/split-test.service';
import { UserService } from '../../core/user/user.service';
import { ANALYTICS_EVENT_NAMES } from '../../core/analytics/resources/analytics-event-names';

const CATEGORIES_WITH_EXTRA_FIELDS = ['16000', '12465'];

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
  @Input() suggestionValue: string;

  public itemTypes: any = ITEM_TYPES;
  public currentCategory: CategoryOption;
  public objectTypeTitle: string;
  public objectTypes: IOption[];
  public brands: IOption[];
  public models: IOption[];
  public sizes: IOption[];
  public brandSuggestions: Subject<KeywordSuggestion[]> = new Subject();
  public modelSuggestions: Subject<KeywordSuggestion[]> = new Subject();
  public selectedBrand: Subject<string> = new Subject();
  public selectedModel: Subject<string> = new Subject();

  public uploadForm: FormGroup;
  public currencies: IOption[] = [
    { value: 'EUR', label: '€' },
    { value: 'GBP', label: '£' }
  ];
  public deliveryInfo: any = [{
    size: '20x38x40cm',
    value: {
      min_weight_kg: 0,
      max_weight_kg: 2
    }
  }, {
    size: '20x38x40cm',
    value: {
      min_weight_kg: 2,
      max_weight_kg: 5
    }
  },
  {
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
  private oldDeliveryValue: any;
  public isUrgent = false;
  public customMake = false;
  public customModel = false;
  public isFashionCategory = false;
  public showExtraFields = false;
  private allCategories: CategoryOption[];

  constructor(private fb: FormBuilder,
    private router: Router,
    private errorsService: ErrorsService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private trackingService: TrackingService,
    private generalSuggestionsService: GeneralSuggestionsService,
    private splitTestService: SplitTestService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
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
      extra_info: fb.group({
        object_type: fb.group({
          id: null
        }),
        brand: null,
        model: null,
        size: fb.group({
          id: null
        }),
        gender: null
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
    this.categoryService.getUploadCategories().subscribe((categories: CategoryOption[]) => {
      this.allCategories = categories;
      this.categories = categories.filter((category: CategoryOption) => {
        return !this.categoryService.isHeroCategory(+category.value);
      });
      if (!this.item) {
        if (this.categoryId && this.categoryId !== '-1') {
          this.uploadForm.get('category_id').patchValue(this.categoryId);
          const fixedCategory = find(categories, { value: this.categoryId });
          this.fixedCategory = fixedCategory ? fixedCategory.label : null;
          this.uploadForm.get('delivery_info').patchValue(null);
        } else {
          this.fixedCategory = null;
        }
      } else {
        const selectedCategory = find(categories, { value: this.item.categoryId.toString() });
        if (this.categoryService.isHeroCategory(this.item.categoryId)) {
          this.fixedCategory = selectedCategory ? selectedCategory.label : null;
        }
        this.uploadForm.patchValue({
          id: this.item.id,
          title: this.item.title,
          sale_price: this.item.salePrice,
          currency_code: this.item.currencyCode,
          description: this.item.description,
          sale_conditions: this.item.saleConditions ? this.item.saleConditions : {},
          category_id: this.item.categoryId.toString(),
          delivery_info: this.getDeliveryInfo(),
          extra_info: this.item.extraInfo ? this.item.extraInfo : {}
        });
        this.oldDeliveryValue = this.getDeliveryInfo();
        this.handleItemExtraInfo(false, selectedCategory);
      }
      this.detectFormChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.categoryId) {
      this.setFixedCategory(changes.categoryId.currentValue);
    }
  }

  private detectFormChanges() {
    this.uploadForm.valueChanges.subscribe((value) => {
      const oldItemData = omit(this.oldFormValue, ['images', 'location']);
      const newItemData = omit(value, ['images', 'location']);
      if (!this.oldFormValue) {
        this.oldFormValue = value;
      } else {
        if (!isEqual(oldItemData, newItemData)) {
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

  ngAfterContentInit() {
    if (!this.item && this.titleField && !this.focused) {
      this.titleField.nativeElement.focus();
      this.focused = true;
    }
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      if (CATEGORIES_WITH_EXTRA_FIELDS.includes(this.uploadForm.value.category_id)) {
        if (this.uploadForm.value.extra_info.brand === '') {
          this.uploadForm.value.extra_info.brand = null;
        }
        if (this.uploadForm.value.extra_info.model === '') {
          this.uploadForm.value.extra_info.model = null;
        }
      } else {
        delete this.uploadForm.value.extra_info;
      }
      if (this.item && this.item.itemType === this.itemTypes.CONSUMER_GOODS) {
        this.uploadForm.value.sale_conditions.shipping_allowed = this.uploadForm.value.delivery_info ? true : false;
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
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_SUCCESS, { category: this.uploadForm.value.category_id });
      appboy.logCustomEvent('Edit', { platform: 'web' });
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_UPLOADFROMFORM);
      appboy.logCustomEvent('List', { platform: 'web' });
      if (CATEGORIES_WITH_EXTRA_FIELDS.includes(this.uploadForm.value.category_id)) {
        this.splitTestService.track('UploadCompleted');
      }
    }

    if (this.isUrgent) {
      this.trackingService.track(TrackingService.UPLOADFORM_CHECKBOX_URGENT, { category: this.uploadForm.value.category_id });
      uploadEvent.action = 'urgent';
      localStorage.setItem('transactionType', 'urgent');
    }

    this.item ? this.trackEditOrUpload(true, uploadEvent.response.content) : this.trackEditOrUpload(false, uploadEvent.response.content);

    this.router.navigate(['/catalog/list', { [uploadEvent.action]: true, itemId: uploadEvent.response.id }]);
  }

  onError(response: any) {
    this.loading = false;
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_ERROR, { category: this.uploadForm.value.category_id });
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
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v < min ? { 'min': { 'requiredMin': min, 'actualMin': v } } : null;
    };
  }

  private max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v > max ? { 'max': { 'requiredMax': max, 'actualMax': v } } : null;
    };
  }

  public selectUrgent(isUrgent: boolean): void {
    this.isUrgent = isUrgent;
  }

  private setFixedCategory(categoryId: string) {
    if (categoryId === '-1') {
      this.fixedCategory = null;
    } else {
      const fixedCategory = find(this.allCategories, { value: categoryId });
      this.fixedCategory = fixedCategory ? fixedCategory.label : null;
    }
  }

  public setCategory(value: number): void {
    this.onCategorySelect.emit(value);
  }

  public emitLocation(): void {
    this.locationSelected.emit(this.categoryId);
  }

  public getBrands(brandKeyword: string) {
    const suggestions: KeywordSuggestion[] = [];

    this.generalSuggestionsService.
      getBrands(brandKeyword, this.uploadForm.value.category_id, this.uploadForm.value.extra_info.object_type.id)
      .subscribe((brands: Brand[]) => {
        if (brands.length > 0) {
          brands.map((brand: Brand) => {
            suggestions.push({ suggestion: brand.brand, value: brand });
          });

          this.brandSuggestions.next(suggestions);
        } else {
          this.generalSuggestionsService.
            getBrandsAndModels(brandKeyword, this.uploadForm.value.category_id, this.uploadForm.value.extra_info.object_type.id)
            .subscribe((brandsAndModels: BrandModel[]) => {
              brandsAndModels.map((brandAndModel: BrandModel) => {
                const suggestionText = `${brandAndModel.brand}${brandAndModel.model ? ', ' + brandAndModel.model : ''} `;

                suggestions.push({ suggestion: suggestionText, value: brandAndModel });
              });

              this.brandSuggestions.next(suggestions);
            });
        }
      });
  }

  public getModels(modelKeyword: string) {
    this.generalSuggestionsService.
      getModels(
        modelKeyword,
        this.uploadForm.value.category_id,
        this.uploadForm.value.extra_info.brand,
        this.uploadForm.value.extra_info.object_type.id)
      .subscribe((models: Model[]) => {
        const suggestions: KeywordSuggestion[] = [];

        models.map((model: Model) => {
          suggestions.push({ suggestion: model.model, value: model });
        });
        this.modelSuggestions.next(suggestions);
      });
  }

  public getSizes() {
    const objectTypeId = this.uploadForm.value.extra_info.object_type.id;
    const gender = this.uploadForm.value.extra_info.gender;

    if (objectTypeId && gender) {
      this.generalSuggestionsService.getSizes(objectTypeId, gender).subscribe((sizes: IOption[]) => {
        this.sizes = sizes;
      });
    }
  }

  public selectBrandOrModel(value = null, type: string) {
    if (value !== null) {
      if (typeof value === 'string') {
        if (type === 'brand') {
          this.setBrand(value);
        }
        if (type === 'model') {
          this.setModel(value);
        }
      } else if (typeof value === 'object') {
        if (value.brand) {
          this.setBrand(value.brand);
        }
        if (value.model) {
          this.setModel(value.model);
        }
      }
    }
  }

  private setBrand(brand: string) {
    this.selectedBrand.next(brand);
    this.uploadForm.patchValue({
      extra_info: {
        brand
      }
    });
  }

  private setModel(model: string) {
    this.selectedModel.next(model);
    this.uploadForm.patchValue({
      extra_info: {
        model
      }
    });
  }

  public handleItemExtraInfo(initializeExtraInfo: boolean, category: CategoryOption) {
    this.currentCategory = category;
    this.isFashionCategory = this.categoryService.isFashionCategory(parseInt(category.value, 10));

    if (category.has_object_type || category.has_brand || category.has_model) {
      this.showExtraFields = true;
      if (!this.item) {
        this.splitTestService.track('CategoryWithBrandModelSelected');
      }
      if (category.has_object_type) {
        this.objectTypeTitle = category.object_type_title;
        this.generalSuggestionsService.getObjectTypes(category.value).subscribe((objectTypes: IOption[]) => {
          this.objectTypes = objectTypes;
        });
      }
    } else {
      this.showExtraFields = false;
    }

    if (initializeExtraInfo) {
      this.initializeItemExtraInfo(null);
    }

    if (this.isFashionCategory) {
      this.getSizes();
    }
  }

  public initializeItemExtraInfo(objectType) {
    this.uploadForm.patchValue({
      extra_info: {
        object_type: {
          id: objectType
        },
        brand: null,
        model: null,
        size: {
          id: null
        },
        gender: this.isFashionCategory ? this.uploadForm.value.extra_info.gender : null
      }
    });

    delete this.sizes;
    this.setModel(null);
    this.setBrand(null);

    this.getBrandPlaceholder();
  }

  public getBrandPlaceholder() {
    return this.isFashionCategory ? 'fashion_brand_example' : 'phones_brand_example';
  }

  public onDeliveryChange(newDeliveryValue: any) {
    if (newDeliveryValue === this.oldDeliveryValue) {
      this.uploadForm.controls['delivery_info'].reset();
      delete this.oldDeliveryValue;
    } else {
      this.oldDeliveryValue = newDeliveryValue;
    }
  }

  private trackEditOrUpload(isEdit: boolean, item: ItemContent) {
    this.userService.isProUser().subscribe((isProfessional: boolean) => {
      let baseEventAttrs: any = {
        itemId: item.id,
        categoryId: item.category_id,
        salePrice: item.sale_price,
        title: item.title,
        isPro: isProfessional
      };

      if (item.extra_info) {
        if (item.extra_info.object_type.id) {
          baseEventAttrs.objectType = item.extra_info.object_type.name;
        }
        if (item.extra_info.brand) {
          baseEventAttrs.brand = item.extra_info.brand;
        }
        if (item.extra_info.model) {
          baseEventAttrs.model = item.extra_info.model;
        }
      }

      if (isEdit) {
        const eventAttrs: EditItemCG = {
          ...baseEventAttrs,
          screenId: SCREENS_IDS.EditItem
        };

        this.analyticsService.trackEvent({
          name: ANALYTICS_EVENT_NAMES.EditItemCG,
          eventType: EVENT_TYPES.Other,
          attributes: eventAttrs
        });
      } else {
        const eventAttrs: ListItemCG = {
          ...baseEventAttrs,
          screenId: SCREENS_IDS.Upload
        };

        this.analyticsService.trackEvent({
          name: ANALYTICS_EVENT_NAMES.ListItemCG,
          eventType: EVENT_TYPES.Other,
          attributes: eventAttrs
        });
      }
    });
  }

}

