/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchInputComponent } from './search-input.component';
import { I18nService } from '../../core/i18n/i18n.service';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SearchInputComponent],
        providers: [I18nService],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should stream the term', fakeAsync(() => {
    const expectedText = 'hola';
    const input = {
      target: {
        value: 'hola',
      },
    };

    let term: string;
    component.term$.subscribe((t) => {
      term = t;
    });

    component.search(input as unknown as Event);
    tick(400);

    expect(term).toBe(expectedText);
  }));

  describe('closeSearch', () => {
    it('should emit deleteSearch', () => {
      spyOn(component.deleteSearch, 'emit');
      component.input = {
        nativeElement: {
          value: 'mesa',
        },
      };

      component.closeSearch(new Event(''));

      expect(component.deleteSearch.emit).toHaveBeenCalled();
    });

    it('should set the input field to empty', () => {
      component.input = {
        nativeElement: {
          value: 'mesa',
        },
      };

      component.closeSearch(new Event(''));

      expect(component.input.nativeElement.value).toEqual('');
    });
  });
});
