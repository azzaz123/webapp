import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewModalComponent } from './preview-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UPLOAD_FORM_ITEM_VALUES } from '../../../../tests/item.fixtures';

describe('PreviewModalComponent', () => {
  let component: PreviewModalComponent;
  let fixture: ComponentFixture<PreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [ PreviewModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewModalComponent);
    component = fixture.componentInstance;
    component.itemPreview = UPLOAD_FORM_ITEM_VALUES;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
