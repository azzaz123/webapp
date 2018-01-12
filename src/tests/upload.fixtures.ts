import { UploadFile, UploadStatus } from 'ngx-uploader';
import { ITEM_ID, IMAGE } from 'shield';


export const UPLOAD_FILE_NAME: string = 'file.jpg';
export const UPLOAD_FILE_DATE: Date = new Date();
export const UPLOAD_FILE_ID: string = '123';

export const UPLOAD_FILE: UploadFile = {
  fileIndex: 0,
  file: new File(['file'], ''),
  id: UPLOAD_FILE_ID,
  name: UPLOAD_FILE_NAME,
  size: 123,
  type: 'image/jpeg',
  progress: {
    status: UploadStatus.Queue,
    data: {
      percentage: 0,
      speed: null,
      speedHuman: null,
      responseStatus: 200
    }
  },
  lastModifiedDate: UPLOAD_FILE_DATE,
  preview: 'abcdef'
};

export const UPLOAD_FILE_DONE: UploadFile = {
  fileIndex: 0,
  file: new File(['file'], ''),
  id: UPLOAD_FILE_ID,
  name: UPLOAD_FILE_NAME,
  size: 123,
  type: 'image/jpeg',
  progress: {
    status: UploadStatus.Done,
    data: {
      percentage: 0,
      speed: null,
      speedHuman: null,
      responseStatus: 200
    }
  },
  lastModifiedDate: UPLOAD_FILE_DATE,
  preview: 'abcdef',
  response: IMAGE
};

export const CAR_ID: string = 'xzo81pgg4469';

export const UPLOADED_RESPONSE = {
  'id': CAR_ID,
  'currency_code': 'EUR',
  'seller_id': 'l1kmzn82zn3p',
  'modified_date': 1495192163404,
  'images': [{
    'id': 'wzvy5o2r01zl',
    'original_width': 0,
    'original_height': 0,
    'average_hex_color': 'FFFFFF',
    'urls_by_size': {
      'original': 'http://dock7.wallapop.com:8080/shnm-portlet/images?pictureId=500083989&pictureSize=ORIGINAL',
      'small': 'http://dock7.wallapop.com:8080/shnm-portlet/images?pictureId=500083989&pictureSize=ORIGINAL',
      'large': 'http://dock7.wallapop.com:8080/shnm-portlet/images?pictureId=500083989&pictureSize=ORIGINAL',
      'medium': 'http://dock7.wallapop.com:8080/shnm-portlet/images?pictureId=500083989&pictureSize=ORIGINAL',
      'xlarge': 'http://dock7.wallapop.com:8080/shnm-portlet/images?pictureId=500083989&pictureSize=ORIGINAL'
    }
  }],
  'url': 'http://dock7.wallapop.com/i/500073257?_pid=wi&_uid=101',
  'title': 'qweqeqwe',
  'brand': 'Abarth',
  'model': '124 Spider',
  'year': 2017,
  'sale_price': 21312312,
  'version': '1.4 MultiAir 170 2p',
  'km': 3333,
  'gearbox': 'manual',
  'engine': 'others',
  'color': '',
  'horsepower': 170.0,
  'body_type': 'small_car',
  'num_doors': 2,
  'extras': [],
  'storytelling': 'wqeweqewe',
  'sale_conditions': {'fix_price': false, 'exchange_allowed': false, 'shipping_allowed': false},
  'flags': {'pending': false, 'sold': false, 'reserved': false, 'banned': false, 'expired': false},
  'warranty': false,
  'num_seats': 3
};

export const UPLOADED_FILE_FIRST: UploadFile = <UploadFile>{
  ...UPLOAD_FILE,
  response: UPLOADED_RESPONSE
};

export const UPLOADED_FILE_FIRST_ITEM: UploadFile = <UploadFile>{
    ...UPLOADED_FILE_FIRST,
  response: {
    ...UPLOADED_RESPONSE,
    id: ITEM_ID
  }
};

export const UPLOADED_FILE_OTHER: UploadFile = <UploadFile>{
  ...UPLOAD_FILE,
  response: 21341421435
};
