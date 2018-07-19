import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinComponent } from './wallacoin.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WallacoinComponent', () => {
  let component: WallacoinComponent;
  let fixture: ComponentFixture<WallacoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
