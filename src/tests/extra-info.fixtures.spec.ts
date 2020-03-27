export const MOCK_OBJECT_TYPES = [{
    id: '1',
    name: 'object type 1'
  }, {
    id: '2',
    name: 'object type 2'
  }];
  export const MOCK_OBJECT_TYPES_RESPONSE = [{
    value: '1',
    label: 'object type 1'
  }, {
    value: '2',
    label: 'object type 2'
  }];
  export const MOCK_BRAND_MODEL_RESPONSE = [{
    brand: 'brand1',
    model: 'model1'
  }, {
    brand: 'brand2',
    model: 'model2'
  }];
  export const MOCK_MODELS_RESPONSE = [{ model: 'model1' }, { model: 'model2' }];
  export const MOCK_BRANDS_RESPONSE = [{ brand: 'brand1' }, { brand: 'brand2' }];
  export const MOCK_BRAND = 'Apple';
  export const MOCK_MODEL = 'iPhone';
  export const MOCK_OBJECT_TYPE_ID = 130;
  export const MOCK_GENDER = 'male';
  export const MOCK_SIZES = {
    female: [{
      id: 34, text: '35'
    }],
    male: [{
      id: 57, text: '48'
    }]
  };
  export const MOCK_SIZES_RESPONSE = [{
    value: '57',
    label: '48'
  }];
  
  export const MOCK_CONDITIONS = [
    {
      category_id: "16000",
      conditions: [
        {
          id: "un_opened",
          title: "Unopened",
          description: "With its seal"
        },
        {
          id: "new",
          title: "New",
          description: "Never been used"
        },
        {
          id: "as_good_as_new",
          title: "As good as new",
          description: "In perfect condition"
        },
        {
          id: "good",
          title: "Good",
          description: "Quite used, but well preserved"
        },
        {
          id: "fair",
          title: "Fair",
          description: "With evidents signs of use"
        },
        {
          id: "has_given_it_all",
          title: "Has given it all",
          description: "May have to be repaired"
        }
      ]
    }];
  
  export const MOCK_CONDITIONS_RESPONSE = [
    {
      value: "un_opened",
      label: "Unopened",
      description: "With its seal"
    },
    {
      value: "new",
      label: "New",
      description: "Never been used"
    },
    {
      value: "as_good_as_new",
      label: "As good as new",
      description: "In perfect condition"
    },
    {
      value: "good",
      label: "Good",
      description: "Quite used, but well preserved"
    },
    {
      value: "fair",
      label: "Fair",
      description: "With evidents signs of use"
    },
    {
      value: "has_given_it_all",
      label: "Has given it all",
      description: "May have to be repaired"
    }
  ];