import { WalletTransferAmountModel } from './wallet-transfer-amount.model';

describe('WHEN create the model', () => {
  describe('WHEN the total is not defined', () => {
    it('should set the default total', () => {
      const target = new WalletTransferAmountModel(null);

      expect(target.total).toBe(0);
    });
  });

  describe('WHEN the total is not missing', () => {
    it('should set the total', () => {
      const target = new WalletTransferAmountModel(13);

      expect(target.total).toBe(13);
    });
  });

  describe('WHEN the minimum amount is missing', () => {
    it('should set the default minimum amount', () => {
      const target = new WalletTransferAmountModel(-1);

      expect(target.isValid).toBe(false);
    });
  });

  describe('WHEN the minimum amount is not defined', () => {
    it('should set the default minimum amount', () => {
      const target = new WalletTransferAmountModel(-1, null);

      expect(target.isValid).toBe(false);
    });
  });

  describe('WHEN the minimum amount is not missing', () => {
    it('should set the minimum amount', () => {
      const target = new WalletTransferAmountModel(1, 2);

      expect(target.isValid).toBe(false);
    });
  });

  describe('WHEN the amount of decimals is missing', () => {
    it('should set the default amount of decimals', () => {
      const target = new WalletTransferAmountModel(10, -1);

      expect(target.decimalsAsCents).toBe('00');
    });
  });

  describe('WHEN the amount of decimals is not defined', () => {
    it('should set the default amount of decimals', () => {
      const target = new WalletTransferAmountModel(10, -1, null);

      expect(target.decimalsAsCents).toBe('00');
    });
  });

  describe('WHEN the amount of decimals is not missing', () => {
    it('should set the amount of decimals', () => {
      const target = new WalletTransferAmountModel(10, -1, 7);

      expect(target.decimalsAsCents).toBe('0000000');
    });
  });
});

describe('WHEN the integer part is assigned', () => {
  it('should receive the decimals as a formatted number', () => {
    const target = new WalletTransferAmountModel(13.1, 0, 3);

    target.integer = '7';

    expect(target.decimals).toBe('100');
  });

  it('should set the total amount', () => {
    const target = new WalletTransferAmountModel(13.1, 0, 3);

    target.integer = '32';

    expect(target.total).toBe(32.1);
  });
});

describe('WHEN the decimal part is assigned', () => {
  it('should not receive the decimals as a formatted number', () => {
    const target = new WalletTransferAmountModel(13.1, 0, 3);

    target.decimals = '1';

    expect(target.decimals).toBe('1');
  });

  it('should set the total amount', () => {
    const target = new WalletTransferAmountModel(13.1, 0, 3);

    target.decimals = '32';

    expect(target.total).toBe(13.32);
  });
});

describe('WHEN get the integer part as units', () => {
  it('should receive it as a formatted number', () => {
    const target = new WalletTransferAmountModel(13.44, 4);

    const integerPart = target.integerAsUnits;

    expect(integerPart).toBe('13');
  });
});

describe('WHEN get the decimal part as cents', () => {
  it('should receive it as a formatted number', () => {
    const target = new WalletTransferAmountModel(13.45, 0, 7);

    const decimalPart = target.decimalsAsCents;

    expect(decimalPart).toBe('4500000');
  });
});

describe('WHEN the total is empty', () => {
  it('should not get the integer part', () => {
    const target = new WalletTransferAmountModel(12, 3, 2);

    target.empty();

    expect(target.integer).toBeFalsy();
  });

  it('should not get the decimal part', () => {
    const target = new WalletTransferAmountModel(12, 3, 2);

    target.empty();

    expect(target.decimals).toBeFalsy();
  });

  it('should get zero as total', () => {
    const target = new WalletTransferAmountModel(12, 3, 2);

    target.empty();

    expect(target.total).toBe(0);
  });
});

describe('WHEN the integer and the decimal parts are not defined', () => {
  it('should get zero as total', () => {
    const target = new WalletTransferAmountModel(12, 3, 2);

    target.integer = null;
    target.decimals = null;

    expect(target.total).toBe(0);
  });
});

describe('WHEN the amount is empty and the integer part is not defined', () => {
  it('should get zero as total', () => {
    const target = new WalletTransferAmountModel(12, 3, 2);

    target.empty();
    target.integer = null;

    expect(target.total).toBe(0);
  });
});

describe('WHEN the amount is empty and the decimal part is not defined', () => {
  it('should get zero as total', () => {
    const target = new WalletTransferAmountModel(12, 3, 2);

    target.empty();
    target.decimals = null;

    expect(target.total).toBe(0);
  });
});
