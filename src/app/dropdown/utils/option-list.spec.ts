import { OptionList } from "./option-list";
import { Option } from "./option";
import { OPTIONS } from './options.fixtures.spec';


describe('Option-list', () => {
  it('should create an option list', () => {
    const expectedOptions: Option [] = [];
    OPTIONS.forEach(
      (option) => expectedOptions.push(new Option(option))
      );
    expectedOptions[0].highlighted = true;

    const optionList = new OptionList(OPTIONS);

    expect(optionList.options).toEqual(expectedOptions);
    expect(optionList.highlightedOption).toEqual(optionList.options[0]);
  });
});

describe('Filter', () => {
  it('should filter by text if match with some options', () => {
    const optionList = new OptionList(OPTIONS)
    const expectedList = [
      new Option(OPTIONS[0]),
      new Option(OPTIONS[1])
    ]
    expectedList[0].highlighted = true;

    optionList.filter('FIRST')

    expect(optionList.filtered).toEqual(expectedList)
    expect(optionList.hasShown).toBeTruthy();

  });

  it('should create an empty filtered list if not match with any option', () => {
    const optionList = new OptionList(OPTIONS)

    optionList.filter('AAAA')

    expect(optionList.filtered).toEqual([])
    expect(optionList.hasShown).toBeFalsy();
  });

  it('should filter by text with special caracter', () => {
    const optionList = new OptionList(OPTIONS)
    const expectedList = [
      new Option(OPTIONS[0]),
      new Option(OPTIONS[1])
    ]
    expectedList[0].highlighted = true;

    optionList.filter('FÎRST')

    expect(optionList.filtered).toEqual(expectedList)
    expect(optionList.hasShown).toBeTruthy();

  });
});

