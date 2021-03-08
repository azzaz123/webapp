import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFiltersComponent } from './search-filters.component';
import { ViewportService } from '@core/viewport/viewport.service';
import { ReplaySubject } from 'rxjs';
import { ViewportType } from '@core/viewport/viewport.enum';

describe('SearchFiltersComponent', () => {
  let component: SearchFiltersComponent;
  let fixture: ComponentFixture<SearchFiltersComponent>;
  let viewportSubject: ReplaySubject<ViewportType>;

  beforeEach(async () => {
    viewportSubject = new ReplaySubject(1);

    await TestBed.configureTestingModule({
      declarations: [SearchFiltersComponent],
      providers: [
        {
          provide: ViewportService,
          useValue: {
            onViewportChange: viewportSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
