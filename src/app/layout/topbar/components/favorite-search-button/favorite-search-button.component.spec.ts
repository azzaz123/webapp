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

  describe('when clicking on favbutton', () => {
    it('should emit isActive prop to parent', () => {
      spyOn(component.clickedButton, 'emit');
      const nativeElement = fixture.nativeElement;
      const button = nativeElement.querySelector('button');
      component.isActive = true;
      fixture.detectChanges();

      button.dispatchEvent(new Event('click'));
      fixture.detectChanges();

      expect(component.clickedButton.emit).toHaveBeenCalledWith(component.isActive);
    });
  });
});
