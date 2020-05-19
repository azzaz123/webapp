import { CategoryResponse } from './../../core/category/category-response.interface';
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
  SimpleChanges
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
import { Subject, Observable } from 'rxjs';
import { Brand, BrandModel, Model } from '../brand-model.interface';
import { UserService } from '../../core/user/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { tap, map } from 'rxjs/operators';
import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  ListItemCG,
  EditItemCG
} from '../../core/analytics/analytics-constants';
import { CATEGORY_IDS } from '../../core/category/category-ids';

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
  public objectTypes: IOption[];
  public conditions: IOption[];
  public brands: IOption[];
  public models: IOption[];
  public sizes: IOption[];
  public brandSuggestions: Subject<KeywordSuggestion[]> = new Subject();
  public modelSuggestions: Subject<KeywordSuggestion[]> = new Subject();
  public uploadCompletedPercentage = 0;

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
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  @ViewChild('title', { static: true }) titleField: ElementRef;
  private focused: boolean;
  private oldFormValue: any;
  private oldDeliveryValue: any;
  private rawCategories: CategoryResponse[];
  public isUrgent = false;
  public cellPhonesCategoryId = CATEGORY_IDS.CELL_PHONES_ACCESSORIES;
  public fashionCategoryId = CATEGORY_IDS.FASHION_ACCESSORIES;

  constructor(private fb: FormBuilder,
    private router: Router,
    private errorsService: ErrorsService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private trackingService: TrackingService,
    private generalSuggestionsService: GeneralSuggestionsService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    config: NgbPopoverConfig,
    private deviceService: DeviceDetectorService) {
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
      }),
      extra_info: this.fb.group({
        object_type: this.fb.group({
          id: [null, [Validators.required]]
        }),
        brand: [null, [Validators.required]],
        model: [null, [Validators.required]],
        size: this.fb.group({
          id: [null, [Validators.required]]
        }),
        gender: [null, [Validators.required]],
        condition: [null]
      })
    });
    config.placement = 'right';
    config.triggers = 'focus:blur';
    config.container = 'body';
  }

  ngOnInit() {
    this.getUploadCategories().subscribe((categories: CategoryOption[]) => {
      this.categories = categories;

      this.detectCategoryChanges();
      if (this.item) {
        this.initializeEditForm();
      }
      this.detectFormChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.categoryId) {
      if (changes.categoryId.currentValue === '-1') {
        this.uploadForm.get('category_id').reset();
      }
      if (changes.categoryId.currentValue !== '-1') {
        this.uploadForm.patchValue({ category_id: changes.categoryId.currentValue });
      }
    }
  }

  private initializeEditForm() {
    this.uploadForm.patchValue({
      id: this.item.id,
      title: this.item.title,
      sale_price: this.item.salePrice,
      currency_code: this.item.currencyCode,
      description: this.item.description,
      sale_conditions: this.item.saleConditions ? this.item.saleConditions : {},
      category_id: this.item.categoryId.toString(),
      delivery_info: this.getDeliveryInfo(),
      extra_info: this.item.extraInfo || {}
    });
    this.oldDeliveryValue = this.getDeliveryInfo();
    if (+this.item.categoryId === this.fashionCategoryId) {
      this.getSizes();
    }
    this.getObjectTypes();
    this.getConditions();
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

  private detectCategoryChanges() {
    this.uploadForm.get('category_id').valueChanges.subscribe((categoryId: number) => {
      this.getUploadExtraInfoControl().reset();

      if (+categoryId === CATEGORY_IDS.CELL_PHONES_ACCESSORIES) {
        this.enableCellphonesExtraFields();
      }
      if (+categoryId === CATEGORY_IDS.FASHION_ACCESSORIES) {
        this.enableFashionExtraFields();
      }
      if (+categoryId !== CATEGORY_IDS.FASHION_ACCESSORIES && +categoryId !== CATEGORY_IDS.CELL_PHONES_ACCESSORIES) {
        this.disableExtraFields();
      }

      this.getConditions();
      this.onCategorySelect.emit(categoryId);
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
    if (!this.item && this.titleField && !this.focused && !this.deviceService.isMobile()) {
      this.titleField.nativeElement.focus();
      this.focused = true;
    }
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      if (this.item && this.item.itemType === this.itemTypes.CONSUMER_GOODS) {
        this.uploadForm.value.sale_conditions.shipping_allowed = this.uploadForm.value.delivery_info ? true : false;
      }
      this.uploadEvent.emit({
        type: this.item ? 'update' : 'create',
        values: this.uploadForm.value
      });
    } else {
      this.uploadForm.markAsPending();
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
      ga('send', 'event', 'Upload', 'done', 'Web mobile analysis');
    }

    if (this.isUrgent) {
      this.trackingService.track(TrackingService.UPLOADFORM_CHECKBOX_URGENT, { category: this.uploadForm.value.category_id });
      uploadEvent.action = 'urgent';
      localStorage.setItem('transactionType', 'urgent');
    }

    this.trackEditOrUpload(!!this.item, uploadEvent.response.content).subscribe(() =>
      this.router.navigate(['/catalog/list', { [uploadEvent.action]: true, itemId: uploadEvent.response.id }])
    );
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

  public emitLocation(): void {
    this.locationSelected.emit(this.categoryId);
  }

  public getBrands(brandKeyword: string): void {
    const suggestions: KeywordSuggestion[] = [];
    let objectTypeId: number;

    objectTypeId = this.uploadExtraInfoValue.object_type.id;

    this.generalSuggestionsService.
      getBrands(brandKeyword, this.uploadForm.value.category_id, objectTypeId)
      .subscribe((brands: Brand[]) => {
        if (brands.length > 0) {
          brands.map((brand: Brand) => {
            suggestions.push({ suggestion: brand.brand, value: brand });
          });

          this.brandSuggestions.next(suggestions);
        } else {
          this.generalSuggestionsService.
            getBrandsAndModels(brandKeyword, this.uploadForm.value.category_id, objectTypeId)
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

  public getModels(modelKeyword: string): void {
    this.generalSuggestionsService.
      getModels(
        modelKeyword,
        this.uploadForm.value.category_id,
        this.uploadExtraInfoValue.brand,
        this.uploadExtraInfoValue.object_type.id)
      .subscribe((models: Model[]) => {
        const suggestions: KeywordSuggestion[] = [];

        models.map((model: Model) => {
          suggestions.push({ suggestion: model.model, value: model });
        });
        this.modelSuggestions.next(suggestions);
      });
  }

  public getSizes(): void {
    const objectTypeId = this.uploadExtraInfoValue.object_type.id;
    const gender = this.uploadExtraInfoValue.gender;

    if (objectTypeId && gender) {
      this.generalSuggestionsService.getSizes(objectTypeId, gender).subscribe((sizes: IOption[]) => {
        this.getUploadExtraInfoControl('size').enable();
        this.sizes = sizes;
      }, () => {
        this.getUploadExtraInfoControl('size').disable();
        this.sizes = [];
      });
    }
  }

  public getObjectTypes(): void {
    const currentCategorId: number = +this.uploadForm.get('category_id').value;
    this.generalSuggestionsService.getObjectTypes(currentCategorId).subscribe((objectTypes: IOption[]) => {
      this.objectTypes = objectTypes;
    });
  }

  public autoCompleteCellphonesModel(brandModelObj: BrandModel): void {
    if ('model' in brandModelObj) {
      this.getUploadExtraInfoControl().patchValue({
        brand: brandModelObj.brand,
        model: brandModelObj.model
      });
    }
  }

  public resetCellphonesExtraFields(): void {
    this.getUploadExtraInfoControl().patchValue({
      brand: null,
      model: null
    });
  }

  public resetFashionExtraFields(): void {
    this.getUploadExtraInfoControl().patchValue({
      brand: null,
      size: {
        id: null
      },
    });

    this.getSizes();
  }

  public updateUploadPercentage(percentage: number) {
    this.uploadCompletedPercentage = Math.round(percentage);
  }

  private getUploadCategories(): Observable<CategoryOption[]> {
    return this.categoryService.getCategories().pipe(
      tap(categories => this.rawCategories = categories),
      map(categories => this.getConsumerGoodCategories(categories)),
      map(categories => this.getNgSelectOptions(categories)));
  }

  private getConsumerGoodCategories(categories: CategoryResponse[]): CategoryResponse[] {
    const userCategories = categories.filter((category) =>
      category.vertical_id === 'consumer_goods'
    );

    if (this.userService.isPro) {
      return userCategories;
    }
    return userCategories.filter((category) => +category.category_id !== CATEGORY_IDS.HELP);
  }

  private getNgSelectOptions(categories: CategoryResponse[]): CategoryOption[] {
    return categories.map(category => {
      return {
        value: category.category_id.toString(),
        label: category.name,
        icon_id: category.icon_id,
      }
    });
  }

  public isHeroCategory(category_id: number): boolean {
    const HERO_CATEGORIES = [CATEGORY_IDS.CAR, CATEGORY_IDS.SERVICES, CATEGORY_IDS.REAL_ESTATE_OLD, CATEGORY_IDS.JOBS];

    return HERO_CATEGORIES.includes(+category_id);
  }

  private getConditions(): void {
    const currentCategorId: number = +this.uploadForm.get('category_id').value;
    this.conditions = [];
    this.generalSuggestionsService.getConditions(currentCategorId).subscribe((conditions: IOption[]) => {
      this.conditions = conditions;
    });
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
    return this.userService.isProUser()
      .pipe(tap((isProfessional: boolean) => {
        let baseEventAttrs: any = {
          itemId: item.id,
          categoryId: item.category_id,
          salePrice: item.sale_price,
          title: item.title,
          isPro: isProfessional
        };

        if (item.extra_info) {
          if (item.extra_info.object_type && item.extra_info.object_type.id) {
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
          const editItemCGEvent: AnalyticsEvent<EditItemCG> = {
            name: ANALYTICS_EVENT_NAMES.EditItemCG,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              ...baseEventAttrs,
              screenId: SCREEN_IDS.EditItem
            }
          };
          this.analyticsService.trackEvent(editItemCGEvent);
        } else {
          const listItemCGEvent: AnalyticsEvent<ListItemCG> = {
            name: ANALYTICS_EVENT_NAMES.ListItemCG,
            eventType: ANALYTIC_EVENT_TYPES.Other,
            attributes: {
              ...baseEventAttrs,
              screenId: SCREEN_IDS.Upload
            }
          };
          this.analyticsService.trackEvent(listItemCGEvent);
        }
      }));
  }

  private disableExtraFields(): void {
    this.getUploadExtraInfoControl('object_type').disable();
    this.getUploadExtraInfoControl('brand').disable();
    this.getUploadExtraInfoControl('model').disable();
    this.getUploadExtraInfoControl('size').disable();
    this.getUploadExtraInfoControl('gender').disable();
  }

  private enableFashionExtraFields(): void {
    this.getUploadExtraInfoControl('object_type').enable();
    this.getUploadExtraInfoControl('brand').enable();
    this.getUploadExtraInfoControl('size').enable();
    this.getUploadExtraInfoControl('gender').enable();
    this.getUploadExtraInfoControl('model').disable();
  }

  private enableCellphonesExtraFields(): void {
    this.getUploadExtraInfoControl('object_type').enable();
    this.getUploadExtraInfoControl('brand').enable();
    this.getUploadExtraInfoControl('model').enable();
    this.getUploadExtraInfoControl('size').disable();
    this.getUploadExtraInfoControl('gender').disable();
  }

  private getUploadExtraInfoControl(field?: string): AbstractControl {
    return field ? this.uploadForm.get('extra_info').get(field) : this.uploadForm.get('extra_info');
  }

  get uploadExtraInfoValue(): any {
    return this.uploadForm.value['extra_info'];
  }
}

