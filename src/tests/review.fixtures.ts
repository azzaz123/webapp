import { MyReviews } from "../app/core/my-reviews/my-reviews";
import { ReviewItem } from "../app/core/my-reviews/review-item";
import { Review } from "../app/core/my-reviews/review";
import { ReviewUser } from "../app/core/my-reviews/review-user";

export const MY_REVIEWS_DATA = [{
 'item':   {
  'category': {
   'categoryId': 15245,
   'countryCode': 'ES',
   'defaultTitle': 'Electronics',
   'highlighted': false,
   'iconColor': 'hsl(200,90%,76%)',
   'iconName': 'category_Electronics',
   'numPublishedItems': 0,
   'order': '40',
   'title': 'Electrónica',
   'url': '/list/electronica',
   'visible': true,
  },
  'category_id': 15245,
  'id': '5nv4z4drzy73',
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
  'title': 'Vendido con review 13',
  'web_link': 'vendido-con-review-13-562'
 } as ReviewItem,
 'review': {
  'comments': 'Todo correcto 4 estrellas',
  'date': 1503396898000,
  'scoring': 80
 } as Review,
 'type': 'sell',
 'user': {
  'id': 'qvxpzprk630n',
  'image': {
   'large': 'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
   'medium': 'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W640',
   'original': 'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
   'original_height': 200,
   'original_width': 200,
   'small': 'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W320',
   'xlarge': 'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W800',
   'xsmall': 'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=283&pictureSize=W320',
   },
   'micro_name': 'USER T.',
   'web_slug': 'utest2-102'
  } as ReviewUser
}];

export const MOCK_MY_REVIEWS: MyReviews = new MyReviews(
  MY_REVIEWS_DATA[0]['item'],
  MY_REVIEWS_DATA[0]['review'],
  'sell',
  MY_REVIEWS_DATA[0]['user']
);
