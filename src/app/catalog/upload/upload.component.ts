import { AfterViewChecked, Component, ElementRef, EventEmitter, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IOption } from 'ng-select';
import { UploadEvent } from './upload-event.interface';
import { ErrorsService } from 'shield';
import { isPresent } from 'ng2-dnd/src/dnd.utils';
import { CategoryService } from '../../core/category/category.service';
import { CategoryOption } from '../../core/category/category-response.interface';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, AfterViewChecked {

  public uploadForm: FormGroup;
  public currencies: IOption[] = [
    {value: 'EUR', label: '€'},
    {value: 'USD', label: '$'}
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
      min_weight_kg: 5.1,
      max_weight_kg: 10
    }
  }, {
    size: '40x50x60cm',
    value: {
      min_weight_kg: 10.1,
      max_weight_kg: 20
    }
  }, {
    size: '50x60x60cm',
    value: {
      min_weight_kg: 20.1,
      max_weight_kg: 30
    }
  }];
  public categories: CategoryOption[] = [];
  public loading: boolean;
  public fixedCategory: string;
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  @ViewChild('scrollPanel') scrollPanel: ElementRef;
  @ViewChild('title') titleField: ElementRef;
  private focused: boolean;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private errorsService: ErrorsService,
              private categoryService: CategoryService) {
    this.uploadForm = fb.group({
      category_id: ['', [Validators.required]],
      images: [[], [Validators.required]],
      title: ['', [Validators.required]],
      sale_price: ['', [Validators.required, this.min(0), this.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      description: ['', [Validators.required]],
      sale_conditions: fb.group({
        fix_price: false,
        exchange_allowed: false,
        shipping_allowed: false
      }),
      delivery_info: [null]
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.categoryService.getUploadCategories().subscribe((categories: CategoryOption[]) => {
        this.categories =  categories.filter((category: CategoryOption) => {
          return category.value !== '13000' && category.value !== '13200';
        });
        if (params.catId) {
          this.uploadForm.get('category_id').patchValue(params.catId);
          const fixedCategory = _.find(categories, {value: params.catId});
          this.fixedCategory = fixedCategory ? fixedCategory.label : null;
        }
      });
    });
    this.uploadForm.get('sale_conditions.shipping_allowed').valueChanges.subscribe((value: boolean) => {
      const deliveryInfoControl: AbstractControl = this.uploadForm.get('delivery_info');
      if (value) {
        deliveryInfoControl.setValidators([Validators.required]);
      } else {
        deliveryInfoControl.setValidators([]);
      }
      deliveryInfoControl.updateValueAndValidity();
    });
  }

  ngAfterViewChecked() {
    setTimeout(() => {
      if (this.titleField && !this.focused) {
        this.titleField.nativeElement.focus();
        this.focused = true;
      }
    });
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.loading = true;
      this.uploadEvent.emit({
        type: 'create',
        values: this.uploadForm.value
      });
    } else {
      for (let control in this.uploadForm.controls) {
        if (this.uploadForm.controls.hasOwnProperty(control) && !this.uploadForm.controls[control].valid) {
          this.uploadForm.controls[control].markAsDirty();
        }
      }
      if (!this.uploadForm.get('images').valid) {
        this.errorsService.i18nError('missingImageError');
      } else {
        this.errorsService.i18nError('formErrors');
        this.scrollPanel.nativeElement.scrollTop = 0;
      }
    }
  }

  onUploaded(itemId: string) {
    this.errorsService.i18nSuccess('productCreated');
    this.router.navigate(['/catalog/list', {created: true}]);
  }

  onError(response: any) {
    this.loading = false;
  }

  private min(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (isPresent(Validators.required(control))) {
        return null;
      }
      let v: number = Number(control.value);
      return v < min ? {'min': {'requiredMin': min, 'actualMin': v}} : null;
    };
  }

  private max(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (isPresent(Validators.required(control))) {
        return null;
      }
      let v: number = Number(control.value);
      return v > max ? {'max': {'requiredMax': max, 'actualMax': v}} : null;
    };
  }

}
