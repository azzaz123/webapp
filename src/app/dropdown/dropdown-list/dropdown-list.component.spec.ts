import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionList } from '../utils/option-list';

import { DropdownListComponent } from './dropdown-list.component';

describe('SelectDropdownComponent', () => {
  let component: DropdownListComponent;
  let fixture: ComponentFixture<DropdownListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.optionList = new OptionList(null);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
