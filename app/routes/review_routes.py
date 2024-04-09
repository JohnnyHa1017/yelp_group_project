from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Review, db, ReviewImage, User
from app.forms.review_form import CreateReview, ReviewImageForm
from .aws_helpers import upload_file_to_s3, get_unique_filename

bp = Blueprint('review_routes', __name__, url_prefix='/api/reviews')

# GET allReviews
@bp.route('/all')
def all_reviews():
    all_reviews = Review.query.all()
    review_img = ReviewImage.query.all()
    all_users = User.query.all()
    review_list = [review.to_dict() for review in all_reviews]
    review_img_list = [image.to_dict() for image in review_img]
    user_list = [user.to_dict() for user in all_users]
    data = {"Review": review_list, "ReviewImage": review_img_list, 'User':user_list}
    return data

# Update review
@bp.route('/<int:id>/update', methods=['PUT'])
@login_required
def update_review(id):
    review = Review.query.get(id)

    if not review:
        return jsonify({'error': 'Review not found'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403


    form = CreateReview()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return jsonify({'error': form.errors}), 400

    form.populate_obj(review)
    db.session.commit()

    return jsonify({'message': 'Review updated successfully'})


# DELETE REVIEW BY REVIEW ID /:reviewId/delete
@bp.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_review(id):
    review = Review.query.get(id)

    if not review:
        return jsonify({'error': 'Review not found'}), 404

    if review.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({'message': 'Successfully Deleted'}), 200

# POST Review Images
@bp.route('/<int:id>/images', methods=['POST'])
@login_required
def post_review_images(id):
    review = Review.query.get(id)

    form = ReviewImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        image = form.data['url']
        image_url = None

        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        if 'url' not in upload:
            return jsonify({'errors': 'Image failed to upload'}), 400

        image_url = upload['url']

        review_image = ReviewImage(
            review_id = review.id,
            url = image_url
        )

        db.session.add(review_image)
        db.session.commit()

        return jsonify({'message': 'Successfully uploaded image'}), 200
    return form.errors, 400


# PUT Business Images
@bp.route('/<int:id>/update/images', methods=['PUT'])
@login_required
def update_review_images(id):
    review_image = ReviewImage.query.get(id)
    review = Review.query.filter(Review.id == review_image.review_id).first()

    if not review_image:
        return jsonify({'errors': 'Review image was not found'}), 404

    if review.user_id != current_user.id:
        return jsonify({'errors': 'You are not authorized to edit this review image.'}), 403

    form = ReviewImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate():
        if 'url' in request.files:
            update_request = request.files['url']
            update_request.filename = get_unique_filename(update_request.filename)
            upload = upload_file_to_s3(update_request)

            if 'url' not in upload:
                return jsonify({'errors': 'Failed to upload image'}), 400

            review_image.url = upload['url']
        db.session.commit()

        return jsonify({'message': 'Image updated successfully'}), 200
    return jsonify({'errors': form.errors}), 400


# DELETE Review Images
# @bp.route('/<int:id>/delete/images', methods=['DELETE'])
# @login_required
# def delete_review_images(id):
#     review_image = ReviewImage.query.get(id)

