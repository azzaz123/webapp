import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '@core/item/item';
import { SocialShareService } from '@core/social-share/social-share.service';
import { ItemLocation } from '@core/geolocation/address-response.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';

@Component({
  selector: 'tsl-select-location-modal',
  templateUrl: './select-location-modal.component.html',
  styleUrls: ['./select-location-modal.component.scss'],
})
export class LocationSelectorModal implements OnInit {
  public coordinates: ItemLocation;

  public item: Item;
  public productPrice: number;
  public productCurrency: string;

  public locationForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      location: this.fb.group({
        address: ['', [Validators.required]],
        latitude: ['', [Validators.required]],
        longitude: ['', [Validators.required]],
      }),
    });
  }

  onSubmit() {}
}
