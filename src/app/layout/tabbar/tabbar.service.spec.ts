import { TestBed } from '@angular/core/testing';

import { TabbarService } from './tabbar.service';

let tabBarService: TabbarService;

describe('TabbarService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabbarService],
    });

    tabBarService = TestBed.inject(TabbarService);
  });

  describe('hideTabBar', () => {
    it('should emit tabBarHidden event with value true', () => {
      let tabBarHidden: boolean;
      tabBarService.tabBarHidden$.subscribe(
        (hidden) => (tabBarHidden = hidden)
      );

      tabBarService.hideTabBar();

      expect(tabBarHidden).toBe(true);
    });
  });

  describe('showTabBar', () => {
    it('should emit tabBarHidden event with value false', () => {
      let tabBarHidden: boolean;
      tabBarService.tabBarHidden$.subscribe(
        (hidden) => (tabBarHidden = hidden)
      );

      tabBarService.showTabBar();

      expect(tabBarHidden).toBe(false);
    });
  });
});
