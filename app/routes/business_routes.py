from flask import Blueprint, jsonify, request, redirect
from app.models import Business, Menu, Amenity, Review, ReviewImage, BusinessImage, db
from app.forms.business_form import CreateBusiness
from app.forms.menu_form import NewMenu
from app.forms.amenities_form import CreateAmenities
from app.forms.business_form import CreateBusiness, ScheduleForm, BusinessImageForm
from app.forms.review_form import CreateReview
from flask_login import login_required, current_user
from .aws_helpers import get_unique_filename, upload_file_to_s3
import json

bp = Blueprint('business_routes', __name__, url_prefix='/api/business')

#helper function to get all businesses
def get_all_business():
    all_businesses = Business.query.all()
    business_list = [business.to_dict() for business in all_businesses]
    return business_list


# GET all businesses
@bp.route('/businesses')
def all_business():
    all_businesses = Business.query.all()
    all_business_images = BusinessImage.query.all()
    business_list = [business.to_dict() for business in all_businesses]
    business_images_list = [business_images.to_dict() for business_images in all_business_images]
    return jsonify({'Business': business_list, 'Business_Images': business_images_list})


# GET business /:businessId
@bp.route('/<int:id>')
def one_business(id):
    business = Business.query.get(id)
    all_business_images = BusinessImage.query.all()
    business_images_list = [business_images.to_dict() for business_images in all_business_images]
    if not business:
        return jsonify({'error': 'Business not found'}), 404
    else:
        business_dict = business.to_dict()
        return {'Business': business_dict, 'Business_Images': business_images_list}


# POST business
@bp.route('/new', methods=['GET', 'POST'])
@login_required
def create_business():
    form = CreateBusiness()
    form['csrf_token'].data = request.cookies['csrf_token']

    data = request.get_json()
    schedule = data.get('schedule')

    if not form.validate_on_submit():
        return jsonify({'error': form.errors}), 400

    business = Business(owner_id=current_user.id, schedule=schedule)

    form.populate_obj(business)
    db.session.add(business)
    db.session.commit()
    return jsonify(business.to_dict()), 201


# PUT business
    # TODO: MADE A REVISION HERE, NEED TO CHECK AND TEST
@bp.route('/<int:id>/edit', methods=['PUT'])
@login_required
def update_business(id):
    business = Business.query.get(id)

    if not business:
        return jsonify({'error': 'Business not found'}), 404

    if business.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403


    form = CreateBusiness()
    form['csrf_token'].data = request.cookies['csrf_token']

    if not form.validate_on_submit():
        return jsonify({'error': form.errors}), 400

    form.populate_obj(business)
    db.session.commit()

    return jsonify({'message': 'Business updated successfully'})


# DELETE business /:businessId/delete
@bp.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_business(id):
    business = Business.query.get(id)

    if not business:
        return jsonify({'error': 'Business not found'}), 404

    if business.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(business)
    db.session.commit()

    return jsonify({'message': 'Successfully Deleted'}), 200


# GET review /:businessId/review
@bp.route('/<int:id>/review')
def business_review(id):
    all_reviews = Review.query.filter_by(business_id=id).all()
    review_img = ReviewImage.query.all()
    review_list = [review.to_dict() for review in all_reviews]
    review_img_list = [image.to_dict() for image in review_img]
    data = {"Review": review_list, "ReviewImage": review_img_list}

    return data


# POST review /:businessId/review/new
    # TODO: MADE A REVISION HERE, NEED TO CHECK AND TEST
@bp.route('<int:id>/review/new', methods=['GET', 'POST'])
@login_required
def create_review(id):
    form = CreateReview()
    form['csrf_token'].data = request.cookies['csrf_token']

    params = {'business_id': id, 'user_id': current_user.id}
    data = Review(**params)
    form.populate_obj(data)

    if not form.validate_on_submit():
        return jsonify({'error': form.errors}), 400

    db.session.add(data)
    db.session.commit()

    return data.to_dict()


# GET amenities /:businessId/amenity
@bp.route('/<int:id>/amenity', methods=['GET'])
def business_amenities(id):
    amenities = Amenity.query.filter(Amenity.business_id == id)
    amenities_lst = [amenity.to_dict() for amenity in amenities]

    if not amenities:
        return jsonify({'error': 'Amenities not found'}), 404
    else:
        return amenities_lst[0]


# POST amenity /:businessId/amenity/new
@bp.route('/<int:id>/amenity/new', methods=['POST'])
def create_amenities(id):
    form = CreateAmenities()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():

        params = {
            'business_id':id,
            'reservation':form.reservation.data,
            'delivery':form.delivery.data,
            'pickup':form.pickup.data,
            'vegetarian':form.vegetarian.data,
            'accepts_credit_card':form.accepts_credit_card.data,
            'free_wi_fi':form.free_wi_fi,
            'street_parking':form.street_parking.data,
            'good_for_groups':form.good_for_groups.data,
            'outdoor_seating':form.outdoor_seating.data
        }
        data = Amenity(**params)
        form.populate_obj(data)
        db.session.add(data)
        db.session.commit()

        return data.to_dict()
    return jsonify({'error': form.errors}), 400


# GET menu /:businessId/menu
@bp.route('/<int:id>/menu', methods=['GET'])
def business_menu(id):
    menu = Menu.query.filter(Menu.business_id == id).all()
    all_business_images = BusinessImage.query.all()
    menu_lst = [item.to_dict() for item in menu]
    business_images_list = [business_images.to_dict() for business_images in all_business_images]

    if not menu:
        return jsonify({'error': 'Menu not found'}), 404
    else:
        return {'Menu': menu_lst, 'Business_Images': business_images_list}


# POST menu /:businessId/menu/new
@bp.route('/<int:id>/menu/new', methods=['GET', 'POST'])
@login_required
def create_menu(id):
    form = NewMenu()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        params = {'business_id': id}
        data = Menu(**params)
        form.populate_obj(data)
        db.session.add(data)
        db.session.commit()

        return data.to_dict()
    return jsonify({'error': form.errors}), 400

# GET all menus /menus
@bp.route('/menus', methods=['GET'])
def get_all_menus():
    all_menus = Menu.query.all()
    menu_list = [menu.to_dict() for menu in all_menus]
    return menu_list


# POST Business Images (Business, Menu)
@bp.route('/<int:id>/images', methods=['POST'])
@login_required
def post_business_images(id):
    business = Business.query.get(id)

    form = BusinessImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        image = form.data['url']
        image_url = None

        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        if 'url' not in upload:
            return jsonify({'errors': 'Failed to upload image'}), 400

        image_url = upload['url']

        business_image = BusinessImage(
            business_id = business.id,
            url = image_url,
            preview = form.preview.data,
            menu_id = form.menu_id.data
        )

        db.session.add(business_image)
        db.session.commit()

        return jsonify({'message': 'Image uploaded successfully'}), 200
    return jsonify({'errors': form.errors}), 400


# PUT Business Images
@bp.route('/<int:id>/edit/images', methods=['PUT'])
@login_required
def update_business_images(id):
    business_image = BusinessImage.query.get(id)
    business = Business.query.filter(Business.id == business_image.business_id).first()


    if not business_image:
        return jsonify({'errors': 'Business image was not found'}), 404

    if business.owner_id != current_user.id:
        return jsonify({'errors': 'You are not authorized to edit this business image.'}), 403

    form = BusinessImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate():
        if 'url' in request.files:
            update_request = request.files['url']
            update_request.filename = get_unique_filename(update_request.filename)
            upload = upload_file_to_s3(update_request)

            if 'url' not in upload:
                return jsonify({'errors': 'Failed to upload image'}), 400

            business_image.url = upload['url']

        business_image.preview = form.preview.data
        business_image.menu_id = form.menu_id.data

        db.session.commit()

        return jsonify({'message': 'Image updated successfully'}), 200
    return jsonify({'errors': form.errors}), 400

