import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallacoinsTutorialComponent } from './wallacoins-tutorial.component';

describe('WallacoinsTutorialComponent', () => {
  let component: WallacoinsTutorialComponent;
  let fixture: ComponentFixture<WallacoinsTutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinsTutorialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
