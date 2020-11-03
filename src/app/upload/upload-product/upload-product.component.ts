import { CategoryResponse, SuggestedCategory } from './../../core/category/category-response.interface';
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
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IOption } from 'app/dropdown/utils/option.interface';
import { omit, isEqual, cloneDeep } from 'lodash-es';
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
import { Subject, Observable, fromEvent } from 'rxjs';
import { Brand, BrandModel, Model, ObjectType, SimpleObjectType } from '../brand-model.interface';
import { UserService } from '../../core/user/user.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { tap, map, debounceTime } from 'rxjs/operators';
import {
  ANALYTIC_EVENT_TYPES,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsEvent,
  ListItemCG,
  EditItemCG
} from '../../core/analytics/analytics-constants';
import { CATEGORY_IDS } from '../../core/category/category-ids';

function isObjectTypeRequiredValidator(formControl: AbstractControl) {
  const objectTypeControl: FormGroup = formControl?.parent as FormGroup;
  if (!objectTypeControl) { return; }
  const extraInfoControl: FormGroup = objectTypeControl.parent as FormGroup;
  const uploadFormControl: FormGroup = extraInfoControl.parent as FormGroup;
  const categoryIdControl: FormControl = uploadFormControl.get('category_id') as FormControl;
  const categoryId = categoryIdControl.value;

  if (+categoryId === CATEGORY_IDS.FASHION_ACCESSORIES || +categoryId === CATEGORY_IDS.CELL_PHONES_ACCESSORIES) {
    return Validators.required(formControl);
  }
  return null;
}

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
  @Output() onCategorySelect = new EventEmitter<string>();
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  @Input() suggestionValue: string;

  MAX_DESCRIPTION_LENGTH = 640;
  MAX_TITLE_LENGTH = 50;

  public itemTypes: any = ITEM_TYPES;
  public currentCategory: CategoryOption;
  public currentSelectType: IOption;
  public objectTypesOptions: IOption[] = [];
  public objectTypesOptions2: IOption[] = [];
  public objectTypes: ObjectType[] = [];
  public conditions: IOption[] = [];
  public brands: IOption[] = [];
  public models: IOption[] = [];
  public sizes: IOption[] = [];
  public gender: IOption[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];
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
  public selectedRawCategory: CategoryResponse;
  public isUrgent = false;
  public cellPhonesCategoryId = CATEGORY_IDS.CELL_PHONES_ACCESSORIES;
  public fashionCategoryId = CATEGORY_IDS.FASHION_ACCESSORIES;
  public lastSuggestedCategoryText: string;

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
          id: [{ value: null, disabled: true }, [isObjectTypeRequiredValidator]]
        }),
        object_type_2: this.fb.group({
          id: [{ value: null, disabled: true }]
        }),
        brand: [{ value: null, disabled: true }, [Validators.required]],
        model: [{ value: null, disabled: true }, [Validators.required]],
        size: this.fb.group({
          id: [{ value: null, disabled: true }, [Validators.required]]
        }),
        gender: [{ value: null, disabled: true }, [Validators.required]],
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
      this.detectObjectTypeChanges();
      if (this.item) {
        this.initializeEditForm();
      }
      this.detectFormChanges();
      this.handleUploadFormExtraFields();
    });
    this.detectTitleKeyboardChanges();
  }

  private detectTitleKeyboardChanges(): void {
    fromEvent(this.titleField.nativeElement, 'keyup')
      .pipe(
        debounceTime(750)
      )
      .subscribe(
        () => this.searchSuggestedCategories()
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.categoryId) {
      if (changes.categoryId.currentValue === '-1') {
        return this.uploadForm.patchValue({ category_id: '' });
      }
      return this.uploadForm.patchValue({ category_id: changes.categoryId.currentValue });
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
      extra_info: this.getExtraInfo()
    });
    this.oldDeliveryValue = this.getDeliveryInfo();
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

  public getExtraInfo(): any {
    if (!this.item.extraInfo) return {};
    const objectTypeId = this.item.extraInfo.object_type?.id;
    if (objectTypeId) {
      if (!this.objectTypes.find(objectType => objectType.id === objectTypeId)) {
        const objectTypeTree = this.findChildrenObjectTypeById(objectTypeId)
        if (objectTypeTree) {
          return {
            ...this.item.extraInfo,
            object_type: { id: objectTypeTree.parentId },
            object_type_2: { id: objectTypeTree.childrenId }
          }
        }
      }
    }
    return this.item.extraInfo;
  }

  private findChildrenObjectTypeById(id: string): { parentId: string, childrenId: string } {
    if (!this.objectTypes.length) { return null; }
    for (const item of this.objectTypes) {
      if (item.has_children) {
        const selectedChildren = item.children.find(children => children.id === id)
        if (selectedChildren) {
          return {
            parentId: item.id,
            childrenId: selectedChildren.id
          };
        }
      }
    }
  }

  private detectCategoryChanges() {
    this.uploadForm.get('category_id').valueChanges
      .subscribe((categoryId: string) => {
        this.handleUploadFormExtraFields();
        this.resetAllExtraFields();

        if (categoryId === '') {
          this.getUploadExtraInfoControl('object_type').disable();
          this.lastSuggestedCategoryText = '';
          this.searchSuggestedCategories();
        }
        this.onCategorySelect.emit(categoryId);
      });
  }

  private detectObjectTypeChanges() {
    this.getUploadExtraInfoControl('object_type').get('id').valueChanges.subscribe((typeOfbOjectId: number) => {
      if (!!typeOfbOjectId) {
        this.getSecondObjectTypes(typeOfbOjectId);
        if (+this.uploadForm.get('category_id').value === CATEGORY_IDS.FASHION_ACCESSORIES) {
          this.getSizes();
        }
      } else {
        this.clearSecondObjectTypes();
      }
    });
    this.getUploadExtraInfoControl('gender').valueChanges.subscribe((gender: string) => {
      if (!!gender && +this.uploadForm.get('category_id').value === CATEGORY_IDS.FASHION_ACCESSORIES) {
        this.getSizes();
      }
    });
  }

  private handleUploadFormExtraFields(): void {
    const formCategoryId = this.uploadForm.get('category_id').value;
    const rawCategory = this.rawCategories.find(category => category.category_id === +formCategoryId);
    const EXTRA_FIELDS_KEYS = ['type_of_object', 'brand', 'model', 'gender', 'size'];

    if (!!rawCategory) {
      this.selectedRawCategory = rawCategory;
      this.getObjectTypes();
      this.getConditions();

      EXTRA_FIELDS_KEYS.map(field => {
        const formFieldName = field === 'type_of_object' ? 'object_type' : field;

        if (!!rawCategory.fields[field]) {
          if (formFieldName !== 'size') {
            return this.getUploadExtraInfoControl(formFieldName).enable();
          }

          const objectTypeId = this.getUploadExtraInfoControl('object_type').get('id').value;
          const gender = this.getUploadExtraInfoControl('gender').value;
          if (formFieldName === 'size' && objectTypeId && gender) {
            return this.getUploadExtraInfoControl(formFieldName).enable();
          }
        }
        return this.getUploadExtraInfoControl(formFieldName).disable();
      });
    }
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
        values: this.parseUploadForm()
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

  private parseUploadForm(): any {
    const values = cloneDeep(this.uploadForm.value);
    if (values.extra_info.object_type?.id && values.extra_info.object_type_2?.id) {
      values.extra_info.object_type.id = values.extra_info.object_type_2.id
      delete values.extra_info.object_type_2
    }
    return values;
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

    this.trackEditOrUpload(!!this.item, uploadEvent.response).subscribe(() =>
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
    let objectTypeId: number = this.getUploadExtraInfoControl('object_type').get('id').value;

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
        this.uploadForm.get('category_id').value,
        this.getUploadExtraInfoControl('brand').value,
        this.getUploadExtraInfoControl('object_type').get('id').value)
      .subscribe((models: Model[]) => {
        const suggestions: KeywordSuggestion[] = [];

        models.map((model: Model) => {
          suggestions.push({ suggestion: model.model, value: model });
        });
        this.modelSuggestions.next(suggestions);
      });
  }

  public getSizes(): void {
    const objectTypeId = this.getUploadExtraInfoControl('object_type').get('id').value;
    const gender = this.getUploadExtraInfoControl('gender').value;
    this.sizes = [];

    if (objectTypeId && gender) {
      this.generalSuggestionsService.getSizes(objectTypeId, gender).subscribe(
        (sizes: IOption[]) => {
          if (sizes.length) this.getUploadExtraInfoControl('size').enable();
          this.sizes = sizes;
        },
        () => {
          this.getUploadExtraInfoControl('size').disable();
          this.sizes = [];
        });
    }
  }

  public getObjectTypes(): void {
    const currentCategoryId: number = +this.uploadForm.get('category_id').value;
    this.objectTypesOptions = [];
    this.generalSuggestionsService.getObjectTypes(currentCategoryId).subscribe((objectTypes: ObjectType[]) => {
      this.objectTypes = objectTypes;
      this.objectTypesOptions = objectTypes
        .filter((type: ObjectType) => type.id)
        .map((type: ObjectType) => ({
          value: type.id,
          label: type.name
        })
        );

      if (this.item && this.uploadForm.value.extra_info?.object_type?.id) {
        this.uploadForm.patchValue({
          extra_info: this.getExtraInfo()
        });
      }
    });
  }

  public getSecondObjectTypes(id: number): void {
    this.clearSecondObjectTypes();
    const secondObjectType: SimpleObjectType[] = this.objectTypes.find(objectType => objectType.id === id.toString() && objectType.has_children)?.children;
    if (secondObjectType) {
      this.objectTypesOptions2 = secondObjectType
        .map((type: SimpleObjectType) => ({
          value: type.id,
          label: type.name
        }));
      this.getUploadExtraInfoControl('object_type_2').enable()
    }
  }

  private clearSecondObjectTypes(): void {
    this.objectTypesOptions2 = [];
    this.getUploadExtraInfoControl('object_type_2').disable();
  }

  public autoCompleteCellphonesModel(brandModelObj: BrandModel): void {
    if ('model' in brandModelObj) {
      this.getUploadExtraInfoControl().patchValue({
        brand: brandModelObj.brand,
        model: brandModelObj.model
      });
    }
  }

  public resetAllExtraFields(): void {
    this.getUploadExtraInfoControl().reset();
  }

  public resetCommonExtraFields(): void {
    this.getUploadExtraInfoControl().patchValue({
      brand: null,
      model: null,
      size: {
        id: null
      },
      object_type_2: {
        id: null
      }
    });
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

    return userCategories;
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
    const currentCategoryId: number = +this.uploadForm.get('category_id').value;

    this.conditions = [];
    this.getUploadExtraInfoControl('condition').reset();
    this.generalSuggestionsService.getConditions(currentCategoryId).subscribe((conditions: IOption[]) => {
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

  private getUploadExtraInfoControl(field?: string): AbstractControl {
    return field ? this.uploadForm.get('extra_info').get(field) : this.uploadForm.get('extra_info');
  }

  public searchSuggestedCategories(): void {
    const text = this.uploadForm.get('title').value;
    if (!text.length || this.lastSuggestedCategoryText === text) {
      return;
    }

    const categoryId = this.uploadForm.get('category_id').value;
    if (!!categoryId.length && this.isHeroCategory(+categoryId)) {
      return;
    }

    this.categoryService.getSuggestedCategory(text)
      .subscribe(
        (category: SuggestedCategory) => {
          this.lastSuggestedCategoryText = text;
          if (category) {
            this.updateCategory(category);
          }
        }
      )
  }

  public updateCategory(suggestedCategory: SuggestedCategory): void {
    const suggestedId = suggestedCategory.category_id.toString();
    const formCategoryValue = this.uploadForm.get('category_id').value;
    if (this.isFormCategoryChangeNeeded(formCategoryValue, suggestedId)) {
      if (!!formCategoryValue.length) {
        this.errorsService.i18nSuccess('suggestedCategory');
      }
      this.uploadForm.patchValue({
        category_id: suggestedId
      });
    }
  }

  private isFormCategoryChangeNeeded(formCategoryValue: string, suggestedId: string): boolean {
    return formCategoryValue !== suggestedId && this.categories.find(category => category.value === suggestedId) != null;
  }
}
