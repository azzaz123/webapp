import { ElementRef } from '@angular/core';
import { FilterDropdownDirective } from './filter-dropdown.directive';

export class MockElementRef extends ElementRef {
  constructor() {
    super(null);
  }
}

describe('FilterDropdownDirective', () => {
  it('should create an instance', () => {
    const directive = new FilterDropdownDirective(new MockElementRef());
    expect(directive).toBeTruthy();
  });
});
