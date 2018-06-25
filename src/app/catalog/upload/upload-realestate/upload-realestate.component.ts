import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Car } from '../../../core/item/car';
import { IOption } from 'ng-select';
import { RealestateKeysService } from './realestate-keys.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Key } from './key.interface';
import { UploadEvent } from '../upload-event.interface';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-upload-realestate',
  templateUrl: './upload-realestate.component.html',
  styleUrls: ['./upload-realestate.component.scss']
})
export class UploadRealestateComponent implements OnInit {

  @Output() onValidationError: EventEmitter<any> = new EventEmitter();
  @Output() onFormChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  @Input() item: Car;
  @Input() urgentPrice: number;

  public uploadForm: FormGroup;
  public loading: boolean;
  uploadEvent: EventEmitter<UploadEvent> = new EventEmitter();
  public isUrgent = false;

  public operations: Key[];
  public types: Key[];
  public extras: Key[];
  public conditions: IOption[];
  public sellerType: IOption[];
  public currencies: IOption[] = [
    {value: 'EUR', label: '€'},
    {value: 'GBP', label: '£'}
  ];

  constructor(private fb: FormBuilder,
              private realestateKeysService: RealestateKeysService,
              private router: Router,
              private trackingService: TrackingService) {
    this.uploadForm = fb.group({
      id: '',
      category_id: '13000',
      images: [[], [Validators.required]],
      title: ['', [Validators.required]],
      sale_price: ['', [Validators.required, Validators.min(0), Validators.max(999999999)]],
      currency_code: ['EUR', [Validators.required]],
      storytelling: '',
      operation: '',
      type: '',
      condition: '',
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
  }

  ngOnInit() {
    this.realestateKeysService.getOperations().subscribe((operations: Key[]) => {
      this.operations = operations;
    });
    this.realestateKeysService.getConditions().subscribe((conditions: IOption[]) => {
      this.conditions = conditions;
    });
    this.realestateKeysService.getExtras().subscribe((extras: Key[]) => {
      this.extras = extras;
    });
    this.uploadForm.get('operation').valueChanges.subscribe((operation: string) => {
      this.realestateKeysService.getTypes(operation).subscribe((types: Key[]) => {
        this.types = types;
      });
    })
  }

  onUploaded(uploadEvent: any) {
    this.onFormChanged.emit(false);
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_SUCCESS, {category: this.uploadForm.value.category_id});
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_UPLOADFROMFORM);
    }
    if (this.isUrgent) {
      this.trackingService.track(TrackingService.UPLOADFORM_CHECKBOX_URGENT, {category: this.uploadForm.value.category_id});
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
    this.router.navigate(['/catalog/list', params]);
  }

  onError(response: any) {
    this.loading = false;
    if (this.item) {
      this.trackingService.track(TrackingService.MYITEMDETAIL_EDITITEM_ERROR, {category: this.uploadForm.value.category_id});
    } else {
      this.trackingService.track(TrackingService.UPLOADFORM_ERROR);
    }
  }

}
