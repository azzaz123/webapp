/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ArchivableComponent } from './archivable.component';

describe('ArchivableComponent', () => {
  let component: ArchivableComponent;
  let fixture: ComponentFixture<ArchivableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
