import { MyReviews } from "../app/core/my-reviews/my-reviews";
import { MyReviewsResponse } from "../app/core/my-reviews/my-reviews-response.interface";
import {ReviewItem} from "../app/core/my-reviews/review-item";
import {Review} from "../app/core/my-reviews/review";
import { User } from 'shield';

export const MY_REVIEWS_DATA = [{
 'item':   {
 'category': {
 'categoryId': 12465,
 'countryCode': 'es',
 'defaultTitle': 'electronics',
 'highlighted': false,
 'iconColor': 'red',
 'iconName': 'electronics',
 'numPublishedItems': 234,
 'order': '1',
 'title': 'Electrónica',
 'url': '/electronics',
 'visible': true,
 },
 'id':       '5nv4z4drzy73',
 'image':    {
 'large':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
 'medium':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W640',
 'original':        'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
 'original_height': 200,
 'original_width':  200,
 'small':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W320',
 'xlarge':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
 'xsmall':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W320',
 },
 'title':    'Vendido con review 13',
 'webLink': 'vendido-con-review-13-562'
 } as ReviewItem,
 'review': {
 'comments': 'Todo correcto 4 estrellas',
 'date':     1503396898000,
 'scoring':  80
 } as Review,
 'type':   'sell',
 'user':   {
 'id':         'qvxpzprk630n',
 'image':      {
 'large':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
 'medium':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W640',
 'original':        'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
 'original_height': 200,
 'original_width':  200,
 'small':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W320',
 'xlarge':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
 'xsmall':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W320',
 },
 'microName': 'USER T.',
 'webSlug':   'utest2-102'
 }
 }
];

export const MOCK_MY_REVIEWS: MyReviews = new MyReviews(
  MY_REVIEWS_DATA[0]['item'],
  MY_REVIEWS_DATA[0]['review'],
  'sell',
  new User('qvxpzprk630n',
    'USER T.',
    {
     'large':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
     'medium':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W640',
     'original':        'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
     'original_height': 200,
     'original_width':  200,
     'small':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W320',
     'xlarge':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
     'xsmall':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W320',
    }
  )
);
