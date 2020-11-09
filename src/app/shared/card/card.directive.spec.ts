import {
  CardImageDirective,
  CardContentDirective,
  CardFooterDirective,
} from './card.directive';

describe('CardImageDirective', () => {
  it('should create an instance', () => {
    const directive = new CardImageDirective();
    expect(directive).toBeTruthy();
  });
});

describe('CardContentDirective', () => {
  it('should create an instance', () => {
    const directive = new CardContentDirective();
    expect(directive).toBeTruthy();
  });
});

describe('CardFooterDirective', () => {
  it('should create an instance', () => {
    const directive = new CardFooterDirective();
    expect(directive).toBeTruthy();
  });
});
