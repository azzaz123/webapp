import { Review } from '../app/core/review/review';
import { User, USER_ID, MICRO_NAME, USER_WEB_SLUG } from 'shield';
import { ReviewItem } from '../app/core/review/review-item';
import { ReviewResponse } from '../app/core/review/review-response.interface';

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

export const REVIEWS_RESPONSE = [{
  'type':   'sell',
  'item':   {
    'category_id': 15245,
    'id':          '5nv4z4drzy73',
    'image':       REVIEW_ITEM_IMAGE,
    'title':       'Vendido con review 13',
    'web_link':    'vendido-con-review-13-562'
  },
  'review': {
    'date':     1503396898000,
    'scoring':  80,
    'comments': 'Todo correcto 4 estrellas'
  },
  'user':   {
    'id':         USER_ID,
    'image':      REVIEW_USER_IMAGE,
    'micro_name': MICRO_NAME,
    'web_slug':   USER_WEB_SLUG
  }
}] as ReviewResponse[];

export const MOCK_REVIEWS: Review[] = [
  new Review(
    REVIEWS_RESPONSE[0].review.date,
    REVIEWS_RESPONSE[0].review.scoring,
    REVIEWS_RESPONSE[0].type,
    REVIEWS_RESPONSE[0].review.comments,
    new ReviewItem(
      REVIEWS_RESPONSE[0].item.id,
      REVIEWS_RESPONSE[0].item.category_id,
      REVIEWS_RESPONSE[0].item.title,
      REVIEWS_RESPONSE[0].item.image,
      REVIEWS_RESPONSE[0].item.web_link
    ),
    new User(
      REVIEWS_RESPONSE[0].user.id,
      REVIEWS_RESPONSE[0].user.micro_name,
      {urls_by_size: REVIEWS_RESPONSE[0].user.image},
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      REVIEWS_RESPONSE[0].user.web_slug
    )
  )];
