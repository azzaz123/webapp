import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

export const MOCK_PAYVIEW_STATE: PayviewState = {
  costs: {
    buyerCost: {
      deliveryCost: { amount: { integer: 3, decimals: 95, total: 3.95 }, currency: { code: 'EUR', symbol: '€' } },
      fees: { amount: { integer: 6, decimals: 3, total: 6.03 }, currency: { code: 'EUR', symbol: '€' } },
      productPrice: { amount: { integer: 63, decimals: 0, total: 63 }, currency: { code: 'EUR', symbol: '€' } },
      total: { amount: { integer: 72, decimals: 98, total: 72.98 }, currency: { code: 'EUR', symbol: '€' } },
    },
    promotion: null,
  },
  delivery: {
    address: {
      city: 'Montserrat',
      countryIsoCode: 0,
      flatAndFloor: '6, 1',
      fullName: 'buyer jtrx.',
      id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5',
      phoneNumber: '666666666',
      postalCode: '08199',
      region: 'Barcelona',
      street: 'calle jtrx',
    },
    costs: {
      buyerAddressCost: { amount: { integer: 3, decimals: 95, total: 3.95 }, currency: { code: 'EUR', symbol: '€' } },
      carrierOfficeCost: { amount: { integer: 2, decimals: 95, total: 2.95 }, currency: { code: 'EUR', symbol: '€' } },
    },
    methods: {
      deliveryMethods: [
        {
          carrier: 0,
          deliveryTimes: { from: 3, to: 7 },
          icon: 'http://prod-delivery-resources.wallapop.com/Correos.png',
          lastAddressUsed: { id: 'c10c9fa9-9589-4212-991b-43237ac8afd6', label: 'NAVARCLES, CATALUNYA, 13, 08270 Navarcles, Spain' },
          method: 1,
        },
        {
          carrier: null,
          deliveryTimes: { from: 3, to: 7 },
          icon: 'http://prod-delivery-resources.wallapop.com/default_home.png',
          lastAddressUsed: { id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5', label: 'calle jtrx 6, 1, 08199 Montserrat, Spain' },
          method: 0,
        },
      ],
      default: { index: 1 },
      current: {
        carrier: null,
        deliveryTimes: { from: 3, to: 7 },
        icon: 'http://prod-delivery-resources.wallapop.com/default_home.png',
        lastAddressUsed: { id: 'dedfa0ab-d4bd-48da-acf6-f7976d2877d5', label: 'calle jtrx 6, 1, 08199 Montserrat, Spain' },
        method: 0,
      },
    },
  },
  item: {
    id: 'p61v99q1rx65',
    legacyId: null,
    owner: 'v4z4rv0lx86y',
    title: 'camiseta de camuflaje2',
    description: 'parece un MacBook pro',
    categoryId: 15000,
    location: null,
    salePrice: 63,
    currencyCode: 'EUR',
    modifiedDate: 1643886629627,
    url: 'https://api.beta.wallapop.com/i/191234807?_pid=wi&_uid=80395038',
    flags: { pending: false, sold: false, reserved: false, banned: false, expired: false, onhold: false },
    actionsAllowed: null,
    saleConditions: { fix_price: false, exchange_allowed: false, shipping_allowed: true, supports_shipping: true },
    mainImage: {
      id: 'p61o49n27gj5',
      urls_by_size: {
        small: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W320',
        original: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W1024',
        large: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W800',
        xlarge: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W1024',
        medium: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W640',
      },
      average_hex_color: '5d7f96',
      original_width: 0,
      original_height: 0,
    },
    images: [
      {
        id: 'p61o49n27gj5',
        urls_by_size: {
          small: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W320',
          original: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W1024',
          large: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W800',
          xlarge: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W1024',
          medium: 'http://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W640',
        },
        average_hex_color: '5d7f96',
        original_width: 0,
        original_height: 0,
      },
    ],
    webSlug: 'camiseta-de-camuflaje-191234807',
    deliveryInfo: { min_weight_kg: 2, max_weight_kg: 5 },
    itemType: 'consumer_goods',
    extraInfo: { object_type: { id: null, name: null }, size: { id: null }, condition: null },
    car_info: null,
    km: null,
    bumpFlags: null,
    hashtags: [],
    selected: false,
  },
  itemDetails: {
    categoryId: 15000,
    itemHash: 'p61v99q1rx65',
    pictureUrl: 'https://cdn-beta.wallapop.com/images/10420/35/ut/__/c10420p191234807/i422318107.jpg?pictureSize=W800',
    price: { amount: { integer: 63, decimals: 0, total: 63 }, currency: { code: 'EUR', symbol: '€' } },
    sellerCountry: 'ES',
    sellerUserHash: 'v4z4rv0lx86y',
    title: 'camiseta de camuflaje2',
  },
  payment: {
    card: {
      id: 'eb07a330-f1e6-4816-8e85-9246323fd614',
      brand: 'visa',
      lastFourDigits: '6596',
      ownerFullName: 'test',
      expirationDate: new Date('2025-08-01T00:00:00.000Z'),
      provider: 'mangopay',
    },
    methods: { paymentMethods: [{ method: 1 }, { method: 0 }] },
    preferences: {
      defaults: { paymentMethod: null, useWallet: true, walletBlocked: false },
      preferences: { id: '46211e5c-5d3c-4794-9f45-c10b5f117860', paymentMethod: 1, useWallet: false, walletBlocked: false },
    },
    wallet: { amount: { integer: 0, decimals: 0, total: 0 }, currency: { code: 'EUR', symbol: '€' } },
  },
};
