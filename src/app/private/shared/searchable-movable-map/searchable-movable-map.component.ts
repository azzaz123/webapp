import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const HALF_SECOND: number = 500;

@Component({
  selector: 'tsl-searchable-movable-map',
  templateUrl: './searchable-movable-map.component.html',
  styleUrls: ['./searchable-movable-map.component.scss'],
})
export class SearchableMovableMapComponent implements OnInit {
  public searchLocationForm: FormGroup;
  public locationName: string;

  constructor(private buildForm: FormBuilder) {}

  ngOnInit(): void {
    this.createLocationForm();
  }

  public resetKeyword(): void {
    this.searchLocationForm.reset();
  }

  private createLocationForm(): void {
    this.searchLocationForm = this.buildForm.group({
      searchLocation: [''],
    });
    this.searchSubscription();
  }

  private searchSubscription(): void {
    this.searchLocationForm
      .get('searchLocation')
      .valueChanges.pipe(debounceTime(HALF_SECOND), distinctUntilChanged())
      .subscribe((query) => {
        this.locationName = query;
      });
  }
}
