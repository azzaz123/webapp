import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggesterComponent } from './suggester.component';
import { SuggesterService } from '../../../core/suggester/suggester.service';
import { SUGGESTER_DATA_WEB } from '../../../../tests/suggester.fixtures';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../../../core/event/event.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SuggesterComponent', () => {
  let component: SuggesterComponent;
  let fixture: ComponentFixture<SuggesterComponent>;
  let suggesterService: SuggesterService;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggesterComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: SuggesterService, useValue: {
            getSuggestions: () => {
              return Observable.of(SUGGESTER_DATA_WEB);
            }
          }
        }, EventService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    eventService = TestBed.get(EventService);
    suggesterService = TestBed.get(SuggesterService);
  });

  describe('suggest', (): void => {
    beforeEach(() => {
      spyOn(suggesterService, 'getSuggestions').and.callThrough();
    });
    it('should search for suggestions from input text', () => {
      let input = 'mesa';
      component.suggest(Observable.of(input)).subscribe();
      expect(suggesterService.getSuggestions).toHaveBeenCalled();
    });
    it('should NOT search for suggestions from input < 3', () => {
      let input = 'me';
      component.suggest(Observable.of(input)).subscribe();
      expect(suggesterService.getSuggestions).not.toHaveBeenCalled();
    });
  });

  describe('select suggestion', (): void => {
    it('should emit an event with the selected suggestion', () => {
      spyOn(component.newSearch, 'emit');
      component.selectSuggestion(SUGGESTER_DATA_WEB[0]);
      expect(component.newSearch.emit).toHaveBeenCalledWith(SUGGESTER_DATA_WEB[0]);
    });
  });

  describe('search submit', (): void => {
    it('should emit an event with the keyword parameter', () => {
      component.kwsEl = {
        nativeElement: {
          value: 'mesa'
        }
      };
      spyOn(component.newSearchSubmit, 'emit');
      component.searchSubmit();
      expect(component.newSearchSubmit.emit).toHaveBeenCalledWith('mesa');
    });
  });

});
