import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'tsl-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent implements OnInit {

  public searchControl: FormControl;
  public latitude = 41.3968332;
  public longitude = 2.161399699999947;
  public zoom = 12;
  private result: any;

  @ViewChild('search') searchElementRef: ElementRef;

  constructor(public activeModal: NgbActiveModal,
              private ngZone: NgZone) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.searchElementRef.nativeElement.focus();
    /*this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place && place.geometry) {
            this.result = place;
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 16;
          } else {
            this.result = null;
          }
        });
      });
    });*/
  }

  public setLocation(address: string, latitude: number, longitude: number) {
    this.searchControl.setValue(address);
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = 16;
  }

  public close() {
    this.activeModal.close(this.result);
  }

}
