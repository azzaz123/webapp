/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [SearchInputComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should stream the term', fakeAsync(() => {
    const TEXT: string = 'hola';
    let term: string;
    component.term$.subscribe((t) => {
      term = t;
    });
    component.search(TEXT);
    tick(400);
    expect(term).toBe(TEXT);
  }));

  it('should handle document click', fakeAsync(() => {
    component.active = true;
    document.dispatchEvent(new Event('click'));
    tick();
    expect(component.active).toBeFalsy();
  }));

  it('should skip click on the component', fakeAsync(() => {
    component.active = true;
    fixture.nativeElement.dispatchEvent(new Event('click'));
    tick();
    expect(component.active).toBeTruthy();
  }));

  it('should skip click if input has text', fakeAsync(() => {
    component.active = true;
    component.input = {
      nativeElement: {
        value: 'hola'
      }
    };
    fixture.nativeElement.dispatchEvent(new Event('click'));
    tick();
    expect(component.active).toBeTruthy();
  }));
});
