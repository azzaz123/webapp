import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinComponent } from './wallacoin.component';

describe('WallacoinComponent', () => {
  let component: WallacoinComponent;
  let fixture: ComponentFixture<WallacoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinComponent ]
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
