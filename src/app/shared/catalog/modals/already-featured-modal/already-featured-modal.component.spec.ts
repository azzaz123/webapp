import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyFeaturedModalComponent } from './already-featured-modal.component';

describe('AlreadyFeaturedModalComponent', () => {
  let component: AlreadyFeaturedModalComponent;
  let fixture: ComponentFixture<AlreadyFeaturedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlreadyFeaturedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyFeaturedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
