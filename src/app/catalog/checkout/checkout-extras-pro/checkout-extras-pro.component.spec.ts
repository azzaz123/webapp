import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrasProComponent } from './extras-pro.component';

describe('ExtrasProComponent', () => {
  let component: ExtrasProComponent;
  let fixture: ComponentFixture<ExtrasProComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtrasProComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrasProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
