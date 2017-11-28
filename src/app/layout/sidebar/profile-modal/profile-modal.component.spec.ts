import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileModalComponent } from './profile-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfileModalComponent', () => {
  let component: ProfileModalComponent;
  let fixture: ComponentFixture<ProfileModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [ProfileModalComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
