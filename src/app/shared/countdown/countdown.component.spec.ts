import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { CountdownComponent } from './countdown.component';
import { interval } from 'rxjs';
import { I18nService } from '../../core/i18n/i18n.service';
import * as moment from 'moment';
import { LOCALE_ID } from '@angular/core';

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CountdownComponent],
        providers: [I18nService, { provide: LOCALE_ID, useValue: 'en' }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept moment format', () => {
    const lastTime = moment().add({
      hours: 2,
      seconds: 40,
    });
    const diffTime = lastTime.diff(moment());
    const format = 'DDD HH:mm';

    component.value = lastTime.valueOf();
    component.format = format;
    component.ngOnInit();

    expect(component.message).toEqual(moment.utc(diffTime).format(format));
  });

  describe('listing fee', () => {
    beforeEach(() => {
      component.format = 'listingFee';
    });

    it('should refresh count every 1 minute when countdown is more than 1 hours', fakeAsync(() => {
      let refreshTime = 0;
      component.value = moment().add(2, 'hours');
      component.ngOnInit();

      component['counter$'].subscribe(() => {
        refreshTime++;
      });

      for (let i = 1; i < 3; i++) {
        expect(refreshTime).toBe(i);
        tick(60 * 1000);
      }

      discardPeriodicTasks();
    }));

    it('should refresh count every 1s when countdown is less or equal than 1 hours', fakeAsync(() => {
      let refreshTime = 0;
      component.value = moment().add(1, 'hours');
      component.ngOnInit();

      component['counter$'].subscribe(() => {
        refreshTime++;
      });

      for (let i = 1; i < 3; i++) {
        expect(refreshTime).toBe(i);
        tick(1 * 1000);
      }

      discardPeriodicTasks();
    }));

    it('should refresh count every 1s when countdown is less or equal than 1 hours', fakeAsync(() => {
      let refreshTime = 0;
      component.value = moment().add(1, 'hours');
      component.ngOnInit();

      component['counter$'].subscribe(() => {
        refreshTime++;
      });

      for (let i = 1; i < 3; i++) {
        expect(refreshTime).toBe(i);
        tick(1 * 1000);
      }

      discardPeriodicTasks();
    }));

    it('should show 3 days left', () => {
      component.value = moment().add(2, 'days');
      component.value.add(2, 'seconds');

      component.ngOnInit();

      expect(component.message).toEqual('3 days left');
    });

    it('should show 2 day left', () => {
      component.value = moment().add(1, 'days');
      component.value.add(2, 'seconds');

      component.ngOnInit();

      expect(component.message).toEqual('2 days left');
    });

    /*it('should show 1 day left', () => {
      component.value = moment().add(1, 'days');

      component.ngOnInit();

      expect(component.message).toEqual('1 day left');
    });*/

    it('should show 23 hours left', () => {
      component.value = moment().add(23, 'hours');
      component.value.add(2, 'seconds');

      component.ngOnInit();

      expect(component.message).toEqual('23 hours left');
    });

    it('should show 1 hour left', () => {
      component.value = moment().add(1, 'hours');
      component.value.add(2, 'seconds');

      component.ngOnInit();

      expect(component.message).toEqual('1 hour left');
    });

    it('should show 59 minutes left', () => {
      component.value = moment().add(59, 'minutes');
      component.value.add(2, 'seconds');

      component.ngOnInit();

      expect(component.message).toEqual('59 minutes left');
    });

    it('should show 1 minute left', () => {
      component.value = moment().add(1, 'minutes');
      component.value.add(2, 'seconds');

      component.ngOnInit();

      expect(component.message).toEqual('1 minute left');
    });
  });
});
