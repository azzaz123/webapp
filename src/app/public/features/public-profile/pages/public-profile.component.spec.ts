import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { PublicProfileComponent } from './public-profile.component';

describe('PublicProfileComponent', () => {
  let component: PublicProfileComponent;
  let fixture: ComponentFixture<PublicProfileComponent>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PublicProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: '123' }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we access to a public profile...', () => {
    it('should NOT show the page if NOT user id', () => {
      route.queryParams = of({});

      component.ngOnInit();
      fixture.detectChanges();
      const containerPage = fixture.debugElement.query(
        By.css('.PublicProfile')
      );

      expect(containerPage).toBeFalsy();
      expect(component.userId).toBe(undefined);
    });

    it('should show the page if we have the user id', () => {
      const containerPage = fixture.debugElement.query(
        By.css('.PublicProfile')
      );

      expect(containerPage).toBeTruthy();
      expect(component.userId).toBe('123');
    });
  });
});
