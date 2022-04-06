import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FavoriteSearchButtonComponent } from './favorite-search-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FavoriteSearchButtonComponent', () => {
  let component: FavoriteSearchButtonComponent;
  let fixture: ComponentFixture<FavoriteSearchButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FavoriteSearchButtonComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteSearchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
