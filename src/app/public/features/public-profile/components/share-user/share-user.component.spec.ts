import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareUserComponent } from './share-user.component';

describe('ShareUserComponent', () => {
  let component: ShareUserComponent;
  let fixture: ComponentFixture<ShareUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
