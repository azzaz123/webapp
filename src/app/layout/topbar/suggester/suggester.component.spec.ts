
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggesterComponent } from './suggester.component';
import { SuggesterService } from './suggester.service';
import { SUGGESTER_DATA_WEB } from '../../../../tests/suggester.fixtures.spec';
import { EventService } from '../../../core/event/event.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SuggesterComponent', () => {
  let component: SuggesterComponent;
  let fixture: ComponentFixture<SuggesterComponent>;
  let suggesterService: SuggesterService;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SuggesterComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: SuggesterService, useValue: {
            getSuggestions: () => {
              return observableOf(SUGGESTER_DATA_WEB);
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
    eventService = TestBed.inject(EventService);
    suggesterService = TestBed.inject(SuggesterService);
  });

  describe('suggest', (): void => {
    beforeEach(() => {
      spyOn(suggesterService, 'getSuggestions').and.callThrough();
    });
    it('should search for suggestions from input text', () => {
      const input = 'mesa';

      component.suggest(observableOf(input)).subscribe();

      expect(suggesterService.getSuggestions).toHaveBeenCalled();
    });
    it('should search for suggestions from input < 3', () => {
      const input = 'me';

      component.suggest(observableOf(input)).subscribe();

      expect(suggesterService.getSuggestions).toHaveBeenCalled();
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

  describe('update keyword', (): void => {
    it('should emit an event with the keyword parameter', () => {
      component.kwsEl = {
        nativeElement: {
          value: 'iphone'
        }
      };
      spyOn(component.newKeyword, 'emit');

      component.updateKeyword();

      expect(component.newKeyword.emit).toHaveBeenCalledWith('iphone');
    });
  });

});
