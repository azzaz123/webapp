import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShippingRulesPrice } from '@api/bff/delivery/rules/dtos/shipping-rules';
import { CategoriesApiService } from '@api/categories/categories-api.service';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  EditItemCG,
  ListItemCG,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CATEGORY_IDS, LEGACY_CATEGORY_IDS } from '@core/category/category-ids';
import { CategoryOption, CategoryResponse, SuggestedCategory } from '@core/category/category-response.interface';
import { CategoryService } from '@core/category/category.service';
import { ErrorsService } from '@core/errors/errors.service';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { Item, ITEM_TYPES } from '@core/item/item';
import { DeliveryInfo, ItemContent, ItemResponse, ItemSaleConditions } from '@core/item/item-response.interface';
import { SubscriptionsService, SUBSCRIPTION_TYPES } from '@core/subscriptions/subscriptions.service';
import { PERMISSIONS } from '@core/user/user-constants';
import { UserService } from '@core/user/user.service';
import { NgbModal, NgbModalRef, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { KeywordSuggestion } from '@shared/keyword-suggester/keyword-suggestion.interface';
import { OUTPUT_TYPE, PendingFiles, UploadFile, UploadOutput, UPLOAD_ACTION } from '@shared/uploader/upload.interface';
import { cloneDeep, isEqual, omit } from 'lodash-es';
import { DeviceDetectorService } from 'ngx-device-detector';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, pairwise, startWith, take, tap } from 'rxjs/operators';
import { ProFeaturesComponent } from '../../components/pro-features/pro-features.component';
import { DELIVERY_INFO } from '../../core/config/upload.constants';
import { Brand, BrandModel, Model, ObjectType, SimpleObjectType } from '../../core/models/brand-model.interface';
import { UploadEvent } from '../../core/models/upload-event.interface';
import { GeneralSuggestionsService } from '../../core/services/general-suggestions/general-suggestions.service';
import { ItemReactivationService } from '../../core/services/item-reactivation/item-reactivation.service';
import { UploadService } from '../../core/services/upload/upload.service';
import { PreviewModalComponent } from '../../modals/preview-modal/preview-modal.component';
import { ShippingToggleAllowance } from './services/shipping-toggle/interfaces/shipping-toggle-allowance.interface';
import { ShippingToggleService } from './services/shipping-toggle/shipping-toggle.service';
import { UploadTrackingEventService } from './upload-tracking-event/upload-tracking-event.service';

function isObjectTypeRequiredValidator(formControl: AbstractControl) {
  const objectTypeControl: FormGroup = formControl?.parent as FormGroup;
  if (!objectTypeControl) {
    return;
  }
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
  styleUrls: ['./upload-product.component.scss'],
})
export class UploadProductComponent implements OnInit, AfterContentInit, OnChanges {
  @Input() categoryId: string;
  @Input() item: Item;
  @Input() isReactivation: boolean = false;
  @Input() isActivateShipping: boolean = false;
  @Output() validationError: EventEmitter<any> = new EventEmitter();
  @Output() formChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() categorySelected = new EventEmitter<string>();
  @Input() suggestionValue: string;
  @ViewChild('title', { static: true }) titleField: ElementRef;
  @ViewChild('shippingSection', { static: false }) shippingSectionElement: ElementRef;
  @ViewChild(ProFeaturesComponent) proFeaturesComponent: ProFeaturesComponent;

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
  public genders: IOption[];
  public brandSuggestions: Subject<KeywordSuggestion[]> = new Subject();
  public modelSuggestions: Subject<KeywordSuggestion[]> = new Subject();
  public uploadCompletedPercentage = 0;
  public pendingFiles: PendingFiles;

  public uploadForm: FormGroup;
  public currencies: IOption[] = [
    { value: 'EUR', label: '???' },
    { value: 'GBP', label: '??' },
  ];
  public deliveryInfo = DELIVERY_INFO;
  public categories: CategoryOption[] = [];
  public loading: boolean;
  public uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  public selectedRawCategory: CategoryResponse;
  public cellPhonesCategoryId = CATEGORY_IDS.CELL_PHONES_ACCESSORIES;
  public fashionCategoryId = CATEGORY_IDS.FASHION_ACCESSORIES;
  public lastSuggestedCategoryText: string;
  public isProUser: boolean;

  public isShippabilityAllowed = true;
  public isShippabilityAllowedByCategory = true;
  public priceShippingRules: ShippingRulesPrice;
  public readonly SHIPPING_INFO_HELP_LINK = this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.SHIPPING_SELL_WITH_SHIPPING);
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly DEFAULT_MAX_HASHTAGS = 5;
  public readonly DEBOUNCE_TIME_MS = 500;

  private focused: boolean;
  private oldFormValue: any;
  private oldDeliveryValue: any;
  private rawCategories: CategoryResponse[];
  private dataReadyToValidate$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private errorsService: ErrorsService,
    private categoryService: CategoryService,
    private modalService: NgbModal,
    private generalSuggestionsService: GeneralSuggestionsService,
    private analyticsService: AnalyticsService,
    private userService: UserService,
    config: NgbPopoverConfig,
    private deviceService: DeviceDetectorService,
    private i18n: I18nService,
    private uploadService: UploadService,
    private subscriptionService: SubscriptionsService,
    private itemReactivationService: ItemReactivationService,
    private customerHelpService: CustomerHelpService,
    private shippingToggleService: ShippingToggleService,
    private uploadTrackingEventService: UploadTrackingEventService,
    private categoriesApiService: CategoriesApiService
  ) {
    this.genders = [
      { value: 'male', label: this.i18n.translate(TRANSLATION_KEY.MALE) },
      { value: 'female', label: this.i18n.translate(TRANSLATION_KEY.FEMALE) },
    ];

    this.fillForm();

    config.placement = 'right';
    config.triggers = 'focus:blur';
    config.container = 'body';
  }

  ngOnInit() {
    this.getUploadCategories().subscribe((categories: CategoryOption[]) => {
      this.categories = categories;

      this.detectCategoryChanges();
      this.detectObjectTypeChanges();
      this.detectShippabilityAllowanceChanges();
      this.detectShippabilityChanges();

      if (this.item) {
        this.initializeEditForm();

        this.dataReadyToValidate$.pipe(debounceTime(this.DEBOUNCE_TIME_MS), take(1)).subscribe(() => {
          if (this.isReactivation) {
            this.itemReactivationService.reactivationValidation(this.uploadForm);
          }

          if (this.isActivateShipping) {
            this.handleActivateShipping();
          }
        });
      }
      this.detectFormChanges();
      this.handleUploadFormExtraFields();
    });
    this.detectTitleKeyboardChanges();

    this.updateShippingToggleStatus(this.isShippabilityAllowed, false);
    this.isProUser = this.userService.isProUser();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.categoryId) {
      if (changes.categoryId.currentValue === '-1') {
        return this.uploadForm.patchValue({ category_id: '' });
      }
      return this.uploadForm.patchValue({
        category_id: changes.categoryId.currentValue,
      });
    }
  }

  ngAfterContentInit() {
    if (!this.item && this.titleField && !this.focused && !this.deviceService.isMobile()) {
      this.titleField.nativeElement.focus();
      this.focused = true;
    }
  }

  public getExtraInfo(): any {
    const objectTypeId = this.item.extraInfo?.object_type?.id;
    if (objectTypeId) {
      if (!this.objectTypes.find((objectType) => objectType.id === objectTypeId)) {
        const objectTypeTree = this.findChildrenObjectTypeById(objectTypeId);
        if (objectTypeTree) {
          return {
            ...this.item.extraInfo,
            object_type: { id: objectTypeTree.parentId },
            object_type_2: { id: objectTypeTree.childrenId },
          };
        }
      }
    }
    return this.item.extraInfo;
  }

  public onSubmit(): void {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.proFeaturesComponent?.trackSubmit();
      if (this.item && this.item.itemType === this.itemTypes.CONSUMER_GOODS) {
        this.uploadForm.value.sale_conditions.shipping_allowed = !!this.uploadForm.value.delivery_info;
      }
      this.item ? this.updateItem() : this.createItem();
    } else {
      this.invalidForm();
    }
  }

  public onUploaded(response: ItemContent, action: UPLOAD_ACTION) {
    this.formChanged.emit(false);

    if (response.flags.onhold) {
      this.subscriptionService.getUserSubscriptionType().subscribe((type: SUBSCRIPTION_TYPES) => {
        this.redirectToList(UPLOAD_ACTION.createdOnHold, response, type);
      });
    } else {
      this.redirectToList(action, response);
    }
  }

  public onAddImage(file: UploadFile): void {
    if (this.item) {
      this.uploadService.uploadSingleImage(file, this.item.id, ITEM_TYPES.CONSUMER_GOODS).subscribe(
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

  public onError(error: HttpErrorResponse | any): void {
    this.loading = false;
    this.errorsService.i18nError(TRANSLATION_KEY.SERVER_ERROR, error.message ? error.message : '');
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

  public getBrands(brandKeyword: string): void {
    const suggestions: KeywordSuggestion[] = [];
    let objectTypeId: number = this.getUploadExtraInfoControl('object_type').get('id').value;

    this.generalSuggestionsService.getBrands(brandKeyword, this.uploadForm.value.category_id, objectTypeId).subscribe((brands: Brand[]) => {
      if (brands.length > 0) {
        brands.map((brand: Brand) => {
          suggestions.push({ suggestion: brand.brand, value: brand });
        });

        this.brandSuggestions.next(suggestions);
      } else {
        this.generalSuggestionsService
          .getBrandsAndModels(brandKeyword, this.uploadForm.value.category_id, objectTypeId)
          .subscribe((brandsAndModels: BrandModel[]) => {
            brandsAndModels.map((brandAndModel: BrandModel) => {
              const suggestionText = `${brandAndModel.brand}${brandAndModel.model ? ', ' + brandAndModel.model : ''} `;

              suggestions.push({
                suggestion: suggestionText,
                value: brandAndModel,
              });
            });

            this.brandSuggestions.next(suggestions);
          });
      }

      this.dataReadyToValidate$.next();
    });
  }

  public getModels(modelKeyword: string): void {
    this.generalSuggestionsService
      .getModels(
        modelKeyword,
        this.uploadForm.get('category_id').value,
        this.getUploadExtraInfoControl('brand').value,
        this.getUploadExtraInfoControl('object_type').get('id').value
      )
      .subscribe((models: Model[]) => {
        const suggestions: KeywordSuggestion[] = [];

        models.map((model: Model) => {
          suggestions.push({ suggestion: model.model, value: model });
        });
        this.modelSuggestions.next(suggestions);

        this.dataReadyToValidate$.next();
      });
  }

  public getSizes(): void {
    const objectTypeId = this.objectTypeHasChildren(this.getUploadExtraInfoControl('object_type').get('id').value?.toString())
      ? this.getUploadExtraInfoControl('object_type_2').get('id').value
      : this.getUploadExtraInfoControl('object_type').get('id').value;
    const gender = this.getUploadExtraInfoControl('gender').value;
    this.sizes = [];

    if (objectTypeId && gender) {
      this.generalSuggestionsService.getSizes(objectTypeId, gender).subscribe(
        (sizes: IOption[]) => {
          if (sizes.length) this.getUploadExtraInfoControl('size').enable();
          this.sizes = sizes;

          this.dataReadyToValidate$.next();
        },
        () => {
          this.clearSizes();
        }
      );
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
          label: type.name,
        }));

      if (this.item && this.uploadForm.value.extra_info?.object_type?.id) {
        this.uploadForm.patchValue({
          extra_info: this.getExtraInfo(),
        });
      }

      this.dataReadyToValidate$.next();
    });
  }

  public getSecondObjectTypes(id: number): void {
    this.clearSecondObjectTypes();
    const secondObjectType: SimpleObjectType[] = this.objectTypes.find(
      (objectType) => objectType.id === id.toString() && objectType.has_children
    )?.children;
    if (secondObjectType) {
      this.objectTypesOptions2 = secondObjectType.map((type: SimpleObjectType) => ({
        value: type.id,
        label: type.name,
      }));
      this.getUploadExtraInfoControl('object_type_2').enable();
    }
  }

  public autoCompleteCellphonesModel(brandModelObj: BrandModel): void {
    if ('model' in brandModelObj) {
      this.getUploadExtraInfoControl().patchValue({
        brand: brandModelObj.brand,
        model: brandModelObj.model,
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
        id: null,
      },
      object_type_2: {
        id: null,
      },
    });
  }

  public updateUploadPercentage(percentage: number) {
    this.uploadCompletedPercentage = Math.round(percentage);
  }

  public isHeroCategory(category_id: number): boolean {
    const HERO_CATEGORIES = [CATEGORY_IDS.CAR, CATEGORY_IDS.SERVICES, CATEGORY_IDS.REAL_ESTATE, CATEGORY_IDS.JOBS];
    return HERO_CATEGORIES.includes(+category_id);
  }

  public onDeliveryChange(newDeliveryValue: any) {
    if (newDeliveryValue === this.oldDeliveryValue) {
      this.uploadForm.controls['delivery_info'].reset();
      delete this.oldDeliveryValue;
    } else {
      this.oldDeliveryValue = newDeliveryValue;
    }
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

    this.categoryService.getSuggestedCategory(text).subscribe((category: SuggestedCategory) => {
      this.lastSuggestedCategoryText = text;
      if (category) {
        this.updateCategory(category);
      }
    });
  }

  public updateCategory(suggestedCategory: SuggestedCategory): void {
    const suggestedId = suggestedCategory.category_id.toString();
    const formCategoryValue = this.uploadForm.get('category_id').value;
    if (this.isFormCategoryChangeNeeded(formCategoryValue, suggestedId)) {
      if (!!formCategoryValue.length) {
        this.errorsService.i18nSuccess(TRANSLATION_KEY.SUGGESTED_CATEGORY);
      }
      this.uploadForm.patchValue({
        category_id: suggestedId,
      });
    }
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

  public trackClickHelpTransactionalEvent(): void {
    const categoryId = this.uploadForm.get('category_id')?.value || this.item?.categoryId;
    const price = this.uploadForm.get('sale_price')?.value || this.item?.salePrice;

    this.uploadTrackingEventService.trackClickHelpTransactionalEvent(categoryId, this.userService.user?.id, price, this.item?.id);
  }

  private fillForm(): void {
    this.uploadForm = this.fb.group({
      id: '',
      category_id: ['', [Validators.required]],
      images: [[], [Validators.required]],
      title: ['', [Validators.required]],
      sale_price: ['', [Validators.required, this.min(0), this.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      description: ['', [Validators.required]],
      sale_conditions: this.fb.group({
        fix_price: false,
        exchange_allowed: false,
        supports_shipping: true,
      }),
      delivery_info: [null, [Validators.required]],
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      }),
      extra_info: this.fb.group({
        object_type: this.fb.group({
          id: [{ value: null, disabled: true }, [isObjectTypeRequiredValidator]],
        }),
        object_type_2: this.fb.group({
          id: [{ value: null, disabled: true }, [isObjectTypeRequiredValidator]],
        }),
        brand: [{ value: null, disabled: true }, [Validators.required]],
        model: [{ value: null, disabled: true }, [Validators.required]],
        size: this.fb.group({
          id: [{ value: null, disabled: true }, [Validators.required]],
        }),
        gender: [{ value: null, disabled: true }, [Validators.required]],
        condition: [null],
      }),
      hashtags: [[]],
    });
  }

  private detectTitleKeyboardChanges(): void {
    fromEvent(this.titleField.nativeElement, 'keyup')
      .pipe(debounceTime(750))
      .subscribe(() => this.searchSuggestedCategories());
  }

  private initializeEditForm() {
    this.uploadForm.patchValue({
      id: this.item.id,
      title: this.item.title,
      sale_price: this.item.salePrice,
      currency_code: this.item.currencyCode,
      description: this.item.description,
      sale_conditions: this.getSaleConditions(),
      category_id: this.getCategoryId(),
      delivery_info: this.getDeliveryInfo(),
      extra_info: this.getExtraInfo(),
      images: this.uploadService.convertImagesToFiles(this.item.images),
      hashtags: this.item.hashtags || [],
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
          this.formChanged.emit(true);
        }
        this.oldFormValue = value;
      }
    });
  }

  private findChildrenObjectTypeById(id: string): { parentId: string; childrenId: string } {
    if (!this.objectTypes.length) {
      return null;
    }
    for (const item of this.objectTypes) {
      if (item.has_children) {
        const selectedChildren = item.children.find((children) => children.id === id);
        if (selectedChildren) {
          return {
            parentId: item.id,
            childrenId: selectedChildren.id,
          };
        }
      }
    }
  }

  private detectCategoryChanges() {
    this.uploadForm.get('category_id').valueChanges.subscribe((categoryId: string) => {
      this.handleUploadFormExtraFields();
      this.resetAllExtraFields();

      if (categoryId === '') {
        this.getUploadExtraInfoControl('object_type').disable();
        this.lastSuggestedCategoryText = '';
        this.searchSuggestedCategories();
      }
      this.categorySelected.emit(categoryId);
    });
  }

  private detectObjectTypeChanges() {
    this.getUploadExtraInfoControl('object_type')
      .get('id')
      .valueChanges.subscribe((typeOfbOjectId: number) => {
        if (!!typeOfbOjectId) {
          this.getUploadExtraInfoControl('object_type_2').reset();
          this.getSecondObjectTypes(typeOfbOjectId);

          if (+this.uploadForm.get('category_id').value === CATEGORY_IDS.FASHION_ACCESSORIES) {
            this.getUploadExtraInfoControl('size').disable();
            this.getSizes();
          }
        } else {
          this.clearSecondObjectTypes();
          this.clearSizes();
        }
      });

    this.getUploadExtraInfoControl('object_type_2')
      .get('id')
      .valueChanges.subscribe((typeOfbSecondOjectId: number) => {
        if (!!typeOfbSecondOjectId && +this.uploadForm.get('category_id').value === CATEGORY_IDS.FASHION_ACCESSORIES) {
          this.getSizes();
        }
      });

    this.getUploadExtraInfoControl('gender').valueChanges.subscribe((gender: string) => {
      if (!!gender && +this.uploadForm.get('category_id').value === CATEGORY_IDS.FASHION_ACCESSORIES) {
        this.getSizes();
      }
    });
  }

  private detectShippabilityChanges(): void {
    const supportsShipping = this.uploadForm.get('sale_conditions').get('supports_shipping').value;

    this.uploadForm
      .get('sale_conditions')
      .get('supports_shipping')
      .valueChanges.pipe(startWith(supportsShipping), pairwise())
      .subscribe(([prev, curr]: [boolean, boolean]) => {
        const deliveryInfo = this.uploadForm.get('delivery_info');
        if (prev !== curr) {
          if (curr) {
            this.setRequiredDeliveryInfo(true);
          } else {
            this.setRequiredDeliveryInfo(false);
            deliveryInfo.setValue(null);
          }
        }
      });
  }

  private setRequiredDeliveryInfo(required: boolean) {
    this.uploadForm.get('delivery_info').setValidators(required ? [Validators.required] : []);
  }

  private handleUploadFormExtraFields(): void {
    const formCategoryId = this.uploadForm.get('category_id').value;
    const rawCategory = this.rawCategories.find((category) => category.category_id === +formCategoryId);
    const EXTRA_FIELDS_KEYS = ['type_of_object', 'brand', 'model', 'gender', 'size'];

    if (!!rawCategory) {
      this.selectedRawCategory = rawCategory;
      this.getObjectTypes();
      this.getConditions();

      EXTRA_FIELDS_KEYS.map((field) => {
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
    } else {
      this.dataReadyToValidate$.next();
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

  private getSaleConditions(): ItemSaleConditions {
    this.item.saleConditions.supports_shipping = !!this.item.deliveryInfo;
    return this.item.saleConditions ? this.item.saleConditions : null;
  }

  private getCategoryId(): string | null {
    return LEGACY_CATEGORY_IDS.includes(this.item.categoryId) ? null : this.item.categoryId.toString();
  }

  private invalidForm(): void {
    this.uploadForm.markAsPending();
    if (!this.uploadForm.get('location.address').valid) {
      this.uploadForm.get('location.address').markAsDirty();
    }
    if (!this.uploadForm.get('images').valid) {
      this.errorsService.i18nError(TRANSLATION_KEY.MISSING_IMAGE_ERROR);
    } else if (!this.uploadForm.get('delivery_info').valid && this.uploadForm.get('sale_conditions').get('supports_shipping').value) {
      this.errorsService.i18nError(TRANSLATION_KEY.FINDING_MISSING_WEIGHT_ERROR);
    } else {
      this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR, '', TRANSLATION_KEY.FORM_FIELD_ERROR_TITLE);
      this.validationError.emit();
    }
  }

  private createItem(): void {
    this.uploadService.createItem(this.parseUploadForm(), ITEM_TYPES.CONSUMER_GOODS).subscribe(
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
    this.uploadService.updateItem(this.parseUploadForm(), ITEM_TYPES.CONSUMER_GOODS).subscribe(
      (response: ItemResponse) => {
        this.onUploaded(response.content, UPLOAD_ACTION.updated);
      },
      (error: HttpErrorResponse) => {
        this.onError(error);
      }
    );
  }

  private parseUploadForm(): any {
    const values = cloneDeep(this.uploadForm.value);
    if (values.extra_info.object_type?.id && values.extra_info.object_type_2?.id) {
      values.extra_info.object_type.id = values.extra_info.object_type_2.id;
      delete values.extra_info.object_type_2;
    }

    return values;
  }

  private redirectToList(action: UPLOAD_ACTION, response: ItemContent, type: SUBSCRIPTION_TYPES = SUBSCRIPTION_TYPES.notSubscribed): void {
    const params = this.getRedirectParams(action, response, type);

    this.trackEditOrUpload(!!this.item, response);
    this.router.navigate(['/catalog/list', params]);
  }

  private getRedirectParams(action: UPLOAD_ACTION, response: ItemContent, userType: SUBSCRIPTION_TYPES): void {
    const params: any = {
      [action]: true,
      itemId: response.id,
    };

    if (this.item && this.item.flags.onhold) {
      params.onHold = true;
    }

    if (action === UPLOAD_ACTION.createdOnHold) {
      params.onHoldType = userType;
    }

    return params;
  }

  private min(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v < min ? { min: { requiredMin: min, actualMin: v } } : null;
    };
  }

  private max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (Validators.required(control)) {
        return null;
      }
      const v: number = Number(control.value);
      return v > max ? { max: { requiredMax: max, actualMax: v } } : null;
    };
  }

  private clearSecondObjectTypes(): void {
    this.objectTypesOptions2 = [];
    this.getUploadExtraInfoControl('object_type_2').disable();
  }

  private clearSizes(): void {
    this.sizes = [];
    this.getUploadExtraInfoControl('size').disable();
  }

  private getUploadCategories(): Observable<CategoryOption[]> {
    return this.categoriesApiService.getUploadCategories().pipe(
      tap((categories) => (this.rawCategories = categories)),
      map((categories) => this.getConsumerGoodCategories(categories)),
      map((categories) => this.getNgSelectOptions(categories))
    );
  }

  private getConsumerGoodCategories(categories: CategoryResponse[]): CategoryResponse[] {
    const userCategories = categories.filter((category) => category.vertical_id === 'consumer_goods');

    return userCategories;
  }

  private getNgSelectOptions(categories: CategoryResponse[]): CategoryOption[] {
    return categories.map((category) => {
      return {
        value: category.category_id.toString(),
        label: category.name,
        icon_id: category.icon_id,
      };
    });
  }

  private getConditions(): void {
    const currentCategoryId: number = +this.uploadForm.get('category_id').value;

    this.conditions = [];
    this.getUploadExtraInfoControl('condition').reset();
    this.generalSuggestionsService.getConditions(currentCategoryId).subscribe((conditions: IOption[]) => {
      this.conditions = conditions;
      this.dataReadyToValidate$.next();
    });
  }

  private trackEditOrUpload(isEdit: boolean, item: ItemContent) {
    let baseEventAttrs: any = {
      itemId: item.id,
      categoryId: item.category_id,
      salePrice: item.sale_price,
      title: item.title,
      shippingAllowed: !!item.sale_conditions?.supports_shipping,
      isPro: this.isProUser,
      hashtags: item.hashtags?.toString(),
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

    if (item.delivery_info) {
      baseEventAttrs.shippingWeight = item.delivery_info.max_weight_kg;
    }

    if (isEdit) {
      const editItemCGEvent: AnalyticsEvent<EditItemCG> = {
        name: ANALYTICS_EVENT_NAMES.EditItemCG,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          ...baseEventAttrs,
          screenId: SCREEN_IDS.EditItem,
          salePriceChange: null,
        },
      };

      this.analyticsService.trackEvent(editItemCGEvent);
    } else {
      const listItemCGEvent: AnalyticsEvent<ListItemCG> = {
        name: ANALYTICS_EVENT_NAMES.ListItemCG,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          ...baseEventAttrs,
          screenId: SCREEN_IDS.Upload,
          country: this.analyticsService.market,
          language: this.analyticsService.appLocale,
        },
      };

      this.analyticsService.trackEvent(listItemCGEvent);
    }
  }

  private getUploadExtraInfoControl(field?: string): AbstractControl {
    return field ? this.uploadForm.get('extra_info').get(field) : this.uploadForm.get('extra_info');
  }

  private isFormCategoryChangeNeeded(formCategoryValue: string, suggestedId: string): boolean {
    return formCategoryValue !== suggestedId && !!this.categories.find((category) => category.value === suggestedId);
  }

  private removeFileFromForm(imageId: string): void {
    const imagesControl: FormControl = this.uploadForm.get('images') as FormControl;
    const images: UploadFile[] = imagesControl.value;
    imagesControl.patchValue(images.filter((image) => image.id !== imageId));
  }

  private objectTypeHasChildren(objectTypeId: string): boolean {
    return this.objectTypes.find((objectType) => objectType.id === objectTypeId)?.has_children || false;
  }

  private updateShippingToggleStatus(previousIsShippabilityAllowed: boolean, performRestartIfNecessary: boolean = true): void {
    this.getShippabilittyAllowance().subscribe((shippingToggleAllowance: ShippingToggleAllowance) => {
      this.isShippabilityAllowed = shippingToggleAllowance.category && shippingToggleAllowance.subcategory && shippingToggleAllowance.price;
      this.isShippabilityAllowedByCategory = shippingToggleAllowance.category && shippingToggleAllowance.subcategory;
      this.priceShippingRules = this.shippingToggleService.shippingRules.priceRangeAllowed;

      if (performRestartIfNecessary) {
        if (!this.isShippabilityAllowed) {
          this.restartShippingToggleFormData(false);
        } else if (!previousIsShippabilityAllowed) {
          this.restartShippingToggleFormData(true);
        }
      }
    });
  }

  private getShippabilittyAllowance(): Observable<ShippingToggleAllowance> {
    const categoryId = this.uploadForm.get('category_id')?.value || this.item?.categoryId;
    const subcategoryId = this.getSubcategoryId();
    const price = this.uploadForm.get('sale_price')?.value === 0 ? 0 : this.uploadForm.get('sale_price')?.value || this.item?.salePrice;

    return this.shippingToggleService.isAllowed(categoryId, subcategoryId, price).pipe(take(1));
  }

  private getSubcategoryId(): string {
    const objectTypeLvl1 = this.uploadForm.get('extra_info')?.get('object_type')?.get('id')?.value || this.item?.extraInfo?.object_type?.id;
    const objectTypeLvl2 =
      this.uploadForm.get('extra_info')?.get('object_type_2')?.get('id')?.value || this.item?.extraInfo?.object_type?.id;
    return objectTypeLvl2 || objectTypeLvl1;
  }

  private restartShippingToggleFormData(shippingToggleResetValue: boolean): void {
    this.uploadForm.get('sale_conditions').get('supports_shipping').setValue(shippingToggleResetValue);
    this.uploadForm.get('delivery_info').setValue(null);
  }

  private detectShippabilityAllowanceChanges(): void {
    merge(
      this.uploadForm.get('category_id').valueChanges,
      this.uploadForm.get('extra_info').get('object_type').get('id').valueChanges,
      this.uploadForm.get('extra_info').get('object_type_2').get('id').valueChanges,
      this.uploadForm.get('sale_price').valueChanges
    ).subscribe(() => {
      this.updateShippingToggleStatus(this.isShippabilityAllowed);
    });
  }

  private handleActivateShipping(): void {
    this.restartShippingToggleFormData(true);
    this.scrollToShippingCheckbox();
  }

  private scrollToShippingCheckbox(): void {
    this.shippingSectionElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
