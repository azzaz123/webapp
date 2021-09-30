import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyShippingsComponent } from './my-shippings.component';

describe('MyShippingsComponent', () => {
  let component: MyShippingsComponent;
  let fixture: ComponentFixture<MyShippingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyShippingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyShippingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
