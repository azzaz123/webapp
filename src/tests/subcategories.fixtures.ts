import { MultiSelectFormOption } from '@shared/form/components/multi-select-form/interfaces/multi-select-form-option.interface';

export const SUBCATEGORIES_MOCK: MultiSelectFormOption[] = [
  {
    value: '9568',
    label: 'Abrigos y chaquetones',
  },
  {
    value: '9577',
    label: 'Anoraks y chubasqueros',
  },
  {
    value: '9599',
    label: 'Bombers',
  },
  {
    value: '9573',
    label: 'Cazadoras y chaquetas',
  },
  {
    value: '9606',
    label: 'Gabardinas',
  },
  {
    value: '9613',
    label: 'Parkas',
  },
  {
    value: '9580',
    label: 'Ponchos',
  },
  {
    value: '9591',
    label: 'Toreras',
  },
];

export const SUBCATEGORIES_WITH_CHILDREN_MOCK: MultiSelectFormOption[] = [
  {
    value: '10150',
    label: 'Abrigos y chaquetas',
    children: [
      {
        value: '9568',
        label: 'Abrigos y chaquetones',
      },
      {
        value: '9577',
        label: 'Anoraks y chubasqueros',
      },
      {
        value: '9599',
        label: 'Bombers',
      },
      {
        value: '9573',
        label: 'Cazadoras y chaquetas',
      },
      {
        value: '9606',
        label: 'Gabardinas',
      },
      {
        value: '9613',
        label: 'Parkas',
      },
      {
        value: '9580',
        label: 'Ponchos',
      },
      {
        value: '9591',
        label: 'Toreras',
      },
    ],
  },
  {
    value: '10436',
    label: 'Accesorios',
    children: [
      {
        value: '9550',
        label: 'Cinturones',
      },
      {
        value: '9584',
        label: 'Corbatas',
      },
      {
        value: '9645',
        label: 'Diademas',
      },
      {
        value: '9607',
        label: 'Llaveros',
      },
      {
        value: '9552',
        label: 'Pañuelos',
      },
    ],
  },
  {
    value: '10151',
    label: 'Bañadores y bikinis',
    children: [
      {
        value: '9549',
        label: 'Bikinis',
      },
      {
        value: '9601',
        label: 'Trajes de baño',
      },
    ],
  },
  {
    value: '10437',
    label: 'Belleza y cosmética',
    children: [
      {
        value: '9652',
        label: 'Cepillos',
      },
      {
        value: '9617',
        label: 'Colonias',
      },
      {
        value: '9590',
        label: 'Maquillaje',
      },
      {
        value: '9603',
        label: 'Perfumes',
      },
      {
        value: '9647',
        label: 'Rizadores',
      },
    ],
  },
  {
    value: '10152',
    label: 'Bolsos, maletas y carteras',
    children: [
      {
        value: '9649',
        label: 'Billeteras',
      },
      {
        value: '9555',
        label: 'Bolsas',
      },
      {
        value: '9558',
        label: 'Bolsos',
      },
      {
        value: '9537',
        label: 'Carteras',
      },
      {
        value: '9578',
        label: 'Estuches',
      },
      {
        value: '9614',
        label: 'Maletas',
      },
      {
        value: '9597',
        label: 'Maletines',
      },
      {
        value: '9543',
        label: 'Mochilas',
      },
      {
        value: '9546',
        label: 'Monederos',
      },
      {
        value: '9600',
        label: 'Neceseres',
      },
      {
        value: '9596',
        label: 'Riñoneras',
      },
    ],
  },
  {
    value: '10153',
    label: 'Bufandas y guantes',
    children: [
      {
        value: '9551',
        label: 'Bufandas',
      },
      {
        value: '9610',
        label: 'Guantes',
      },
    ],
  },
  {
    value: '10154',
    label: 'Calzado',
    children: [
      {
        value: '9609',
        label: 'Bailarinas',
      },
      {
        value: '9540',
        label: 'Bambas y zapatillas',
      },
      {
        value: '9563',
        label: 'Botas y botines',
      },
      {
        value: '9576',
        label: 'Chanclas y sandalias',
      },
      {
        value: '9604',
        label: 'Cuñas',
      },
      {
        value: '9583',
        label: 'Mocasines',
      },
      {
        value: '9547',
        label: 'Tacones',
      },
      {
        value: '9560',
        label: 'Zapatos',
      },
      {
        value: '9587',
        label: 'Zuecos',
      },
    ],
  },
  {
    value: '9567',
    label: 'Gafas',
  },
  {
    value: '10156',
    label: 'Joyas',
    children: [
      {
        value: '9534',
        label: 'Anillos',
      },
      {
        value: '9579',
        label: 'Broches',
      },
      {
        value: '9581',
        label: 'Cadenas',
      },
      {
        value: '9539',
        label: 'Colgantes',
      },
      {
        value: '9572',
        label: 'Collares',
      },
      {
        value: '9654',
        label: 'Gemelos',
      },
      {
        value: '9644',
        label: 'Joyeros',
      },
      {
        value: '9571',
        label: 'Pendientes',
      },
      {
        value: '9651',
        label: 'Piercings',
      },
      {
        value: '9570',
        label: 'Pulseras',
      },
      {
        value: '9562',
        label: 'Relojes',
      },
    ],
  },
  {
    value: '10158',
    label: 'Prendas de vestir',
    children: [
      {
        value: '9545',
        label: 'Americanas y blazers',
      },
      {
        value: '9595',
        label: 'Batas',
      },
      {
        value: '9592',
        label: 'Bermudas y shorts',
      },
      {
        value: '9532',
        label: 'Blusas',
      },
      {
        value: '9608',
        label: 'Bodies',
      },
      {
        value: '9561',
        label: 'Camisas',
      },
      {
        value: '9557',
        label: 'Camisetas',
      },
      {
        value: '9650',
        label: 'Camisolas',
      },
      {
        value: '9535',
        label: 'Chalecos',
      },
      {
        value: '9588',
        label: 'Crops',
      },
      {
        value: '9566',
        label: 'Faldas',
      },
      {
        value: '9564',
        label: 'Jerseys',
      },
      {
        value: '9593',
        label: 'Kimonos',
      },
      {
        value: '9615',
        label: 'Minifaldas',
      },
      {
        value: '9544',
        label: 'Monos',
      },
      {
        value: '9533',
        label: 'Pantalones',
      },
      {
        value: '9585',
        label: 'Petos',
      },
      {
        value: '9616',
        label: 'Pijamas',
      },
      {
        value: '9542',
        label: 'Polos',
      },
      {
        value: '9569',
        label: 'Sudaderas',
      },
      {
        value: '9586',
        label: 'Suéteres',
      },
      {
        value: '9538',
        label: 'Tops',
      },
      {
        value: '9548',
        label: 'Vaqueros',
      },
      {
        value: '9556',
        label: 'Vestvalueos',
      },
    ],
  },
  {
    value: '10159',
    label: 'Ropa deportiva',
    children: [
      {
        value: '10429',
        label: 'Camiseta deporte',
      },
      {
        value: '9582',
        label: 'Chándales',
      },
      {
        value: '10430',
        label: 'Monos y pantalones deporte',
      },
      {
        value: '10431',
        label: 'Sujetadores deporte',
      },
      {
        value: '10432',
        label: 'Vestimenta oficial',
      },
    ],
  },
  {
    value: '10160',
    label: 'Ropa interior y calcetines',
    children: [
      {
        value: '9646',
        label: 'Calcetines',
      },
      {
        value: '9653',
        label: 'Calzoncillos',
      },
      {
        value: '9589',
        label: 'Lencería',
      },
      {
        value: '9655',
        label: 'Medias',
      },
      {
        value: '9612',
        label: 'Sujetadores',
      },
    ],
  },
  {
    value: '10161',
    label: 'Ropa premamá',
  },
  {
    value: '10162',
    label: 'Sombreros y gorros',
    children: [
      {
        value: '9541',
        label: 'Gorras',
      },
      {
        value: '9553',
        label: 'Gorros',
      },
      {
        value: '9618',
        label: 'Sombreros',
      },
    ],
  },
  {
    value: '10163',
    label: 'Trajes, fiestas y bodas',
    children: [
      {
        value: '9536',
        label: 'Trajes de hombre',
      },
      {
        value: '10433',
        label: 'Trajes típicos',
      },
      {
        value: '10434',
        label: 'Vestvalueos de fiesta',
      },
      {
        value: '10435',
        label: 'Vestvalueos de novia',
      },
    ],
  },
  {
    value: '9656',
    label: 'Otros',
    children: [
      {
        value: '9602',
        label: 'Disfraces',
      },
      {
        value: '9611',
        label: 'Planchas',
      },
      {
        value: '9648',
        label: 'Secadores',
      },
    ],
  },
];
