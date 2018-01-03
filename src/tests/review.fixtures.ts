import { MyReviews } from "../app/core/my-reviews/my-reviews";
import { Review } from "../app/core/my-reviews/review";
import { User, Item, USER_ID, MICRO_NAME, USER_WEB_SLUG } from "shield";
import {ReviewItem, ReviewImage} from "../app/core/my-reviews/review-item";
import {MyReviewsResponse} from "../app/core/my-reviews/my-reviews-response.interface";

const REVIEW_ITEM_IMAGE = {
 'large':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
 'medium':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W640',
 'original':        'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
 'original_height': 200,
 'original_width':  200,
 'small':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W320',
 'xlarge':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W800',
 'xsmall':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=168&pictureSize=W320',
};

const REVIEW_USER_IMAGE = {
 'large':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=120&pictureSize=W800',
 'medium':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=120&pictureSize=W640',
 'original':        'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=120&pictureSize=W800',
 'original_height': 200,
 'original_width':  200,
 'small':           'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=120&pictureSize=W320',
 'xlarge':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=120&pictureSize=W800',
 'xsmall':          'http://dock133.wallapop.com:8080/shnm-portlet/images?pictureId=120&pictureSize=W320',
};

export const MY_REVIEWS_DATA = [{
 'item':   {
  'category_id': 15245,
  'id': '5nv4z4drzy73',
  'image': REVIEW_ITEM_IMAGE,
  'title': 'Vendido con review 13',
  'web_link': 'vendido-con-review-13-562'
 },
 'review': {
  'comments': 'Todo correcto 4 estrellas',
  'date': 1503396898000,
  'scoring': 80
 },
 'type': 'sell',
 'user': {
  'id': USER_ID,
  'image': REVIEW_USER_IMAGE,
  'micro_name': MICRO_NAME,
  'web_slug': USER_WEB_SLUG
  }
}] as MyReviewsResponse[];

