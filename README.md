# munch!
[![aa-projects-munch.png](https://i.postimg.cc/pV7s4077/aa-projects-munch.png)](https://postimg.cc/DmrQbc7d)
## User Stories

## URL
https://aa-munch.onrender.com

# API Documentation

| Request | Purpose | Return Value |
|----------|----------|----------|
| GET /api/users/    | Returns the information of all users when logged in.    |  {<br>"users":<br>[{"email": "demo@aa.io", <br>"first_name": "Demo", <br>"id": 1, <br>"last_name": "Lition", <br>"username": "Demo"}]<br>}   |
| GET /api/users/:id    | Returns the information about the current user that is logged in.    |  {<br> "email": "demo@aa.io", <br>"first_name": "Demo", <br>"id": 1,<br>"last_name": "Lition",<br>"username": "Demo" <br>}  |
| POST /api/auth/login |  Logs in a current user with valid credentials and returns the current user's information.| {<br>"email": "demo@aa.io",<br>"first_name": "Demo",<br>"id": 1,<br>"last_name": "Lition",<br>"username": "Demo"<br>}
| GET /api/auth/logout |Logs out the current user| {<br>"message": "User logged out"<br>}
| POST /api/users | Creates a new user, logs them in as the current user, and returns the current user's information. | {<br>"email": "john.smith@gmail.com",<br>"first_name": "John",<br>"id": 12,<br>"last_name": "Smith",<br>"username": "JohnSmith"<br>}
| GET /api/reviews/all | Returns all the reviews  | {<br>"Review": [{<br>"business_id": 1,<br>"createdAt": "Mon, 25 Mar 2024 00:03:13 GMT",<br>"id": 1,<br>"image": null,<br>"review": "Had a delightful time at Pokemon Cafe! The ambiance was great, especially for a Pokemon enthusiast like myself. Definitely coming back!",<br>"star": 5,<br>"updatedAt": "Mon, 25 Mar 2024 00:03:13 GMT",<br>"user_id": 2<br>}]<br>}
| PUT /api/reviews/:id/update| Update a review if the review is owned by current user | {<br>"message": "Review updated successfully"<br>}
| DELETE /api/reviews/:id/delete | If the current user is the owner of the review they can delete the review | {<br>'message': 'Successfully Deleted'<br>}
| GET /api/business/:id/review | Retrieves all reviews on a specific business id |  "Review": [<br>{<br>"business_id": 7,<br>"createdAt": "Mon, 25 Mar 2024 00:03:13 GMT",<br>"id": 13,<br>"image": null,"review": "Urahara Shoten was GREAT. The pickup option was convenient with plenty of street parking!",<br>"star": 5,<br>"updatedAt": "Mon, 25 Mar 2024 00:03:13 GMT",<br>"user_id": 2<br>}<br>],<br>"ReviewImage": [<br>{<br>"id": 1,<br>"review_id": 1,<br>"url": "POKEMONurl_for_review_1.jpg"<br>}<br>]
| POST /api/business/:id/review/new | A user can post a review on a business page | {<br>"business_id": 1,<br>"createdAt": "Mon, 08 Apr 2024 22:05:42 GMT",<br>"id": 21,<br>"image": null,<br>"review": "new review!!! WOWOWOWOWOWOW",<br>"star": 3,<br>"updatedAt": "Mon, 08 Apr 2024 22:05:42 GMT",<br>"user_id": 1<br>}
| GET /api/business/businesses    | Returns the information of all businesses.    |  {<br>"Business": [ {<br>"id": 1, <br>"address": "2-4-1 Nihombashi", <br>"category": ["Cafe", "Brunch", "Japanese"], <br>"city": Chuo-ku, <br>"country": "Japan", <br>"description": "A locally owned Cafe perfect for a small bite with friends", <br>"lat": 35.68092399279239, <br>"lng": 139.77345635400394, <br>"owner_id": 6, <br>"phone_number": "555-555-5555", <br>"price_rating": 3, <br>"schedule": "Monday: 6:00am - 3:00pm, Tuesday: 6:00am - 3:00pm, Wednesday: 6:00am - 3:00pm, Thursday: 6:00am - 3:00pm, Friday: 6:00am - 5:00pm, Saturday: 6:00am - 5:00pm, Sunday: 6:00am - 5:00pm", <br>"state": "Tokyo", <br>"title": "Pokemon Cafe", <br>}]}   |
| GET /api/business/:businessId    | Returns business details related to the id.    |  {<br>"Business": [ {<br>"id": 1, <br>"address": "2-4-1 Nihombashi", <br>"category": ["Cafe", "Brunch", "Japanese"], <br>"city": Chuo-ku, <br>"country": "Japan", <br>"description": "A locally owned Cafe perfect for a small bite with friends", <br>"lat": 35.68092399279239, <br>"lng": 139.77345635400394, <br>"owner_id": 6, <br>"phone_number": "555-555-5555", <br>"price_rating": 3, <br>"schedule": "Monday: 6:00am - 3:00pm, Tuesday: 6:00am - 3:00pm, Wednesday: 6:00am - 3:00pm, Thursday: 6:00am - 3:00pm, Friday: 6:00am - 5:00pm, Saturday: 6:00am - 5:00pm, Sunday: 6:00am - 5:00pm", <br>"state": "Tokyo", <br>"title": "Pokemon Cafe", <br>}]}  |
| POST /api/business/new |  A logged in user should be able to create new business.| {<br>"id": 1, <br>"address": "2-4-1 Nihombashi", <br>"category": ["Cafe", "Brunch", "Japanese"], <br>"city": Chuo-ku, <br>"country": "Japan", <br>"description": "A locally owned Cafe perfect for a small bite with friends", <br>"lat": 35.68092399279239, <br>"lng": 139.77345635400394, <br>"owner_id": 6, <br>"phone_number": "555-555-5555", <br>"price_rating": 3, <br>"schedule": "Monday: 6:00am - 3:00pm, Tuesday: 6:00am - 3:00pm, Wednesday: 6:00am - 3:00pm, Thursday: 6:00am - 3:00pm, Friday: 6:00am - 5:00pm, Saturday: 6:00am - 5:00pm, Sunday: 6:00am - 5:00pm", <br>"state": "Tokyo", <br>"title": "Pokemon Cafe", <br>}
| DELETE /api/business/:businessId/delete |Owner should be able delete the business.|{<br>"message": "Successfully deleted"<br>}
| GET /api/menus    | Returns the information of all menus.    |  {<br>"Menu": [ {<br>"id": 1, <br>"business_id": 2, <br>"category": "Appetizer", <br>"description": "Roasted cauliflower baked in a gratin cheese sauce", <br>"name": "Cheese Cauliflower", <br>"price": 8.95, <br>}]}   |
| GET /api/:businessId/menu   | Returns all the menus related to the business.    |  {<br>"Menu": [ {<br>"id": 1, <br>"business_id": 2, <br>"category": "Appetizer", <br>"description": "Roasted cauliflower baked in a gratin cheese sauce", <br>"name": "Cheese Cauliflower", <br>"price": 8.95, <br>}]}  |
| POST /api/:businessId/menu/new |  A owner should be able to create new menu items for the business, .| {<br>"id": 1, <br>"business_id": 2, <br>"category": "Appetizer", <br>"description": "Roasted cauliflower baked in a gratin cheese sauce", <br>"name": "Cheese Cauliflower", <br>"price": 8.95, <br>}
| GET /api/business/:id/amenity | Gets the current businesses offered amenities | {<br>"reservation": true,<br>"delivery": true,<br>"pickup": true,<br>"vegetarian": false,<br>"accepts_credit_card": true,<br>"free_wi_fi": true,<br>"street_parking": true,<br>"good_for_groups": true,<br>"outdoor_seating": false<br>}
| POST /api/business/:id/amenity/new | A business owner should be able to create an amenity page to display what amenities their business offers | {<br>"reservation": true,<br>"delivery": true,<br>"pickup": true,<br>"vegetarian": false,<br>"accepts_credit_card": true,<br>"free_wi_fi": true,<br>"street_parking": true,<br>"good_for_groups": true,<br>"outdoor_seating": false<br>}



### Sign Up
- As an unregistered and unauthorized user, I want to be able to sign up for the website via a sign-up form.
- When I'm on the `/signup` page:
  - I would like to be able to enter my email, username, and preferred password on a clearly laid out form.
  - I would like the website to log me in upon successful completion of the sign-up form, so that I can seamlessly access the site's functionality.
  - When I enter invalid data on the sign-up form:
    - I would like the website to inform me of the validations I failed to pass and repopulate the form with my valid entries (except my password), so that I can try again without needing to refill forms I entered valid data into.

### Log in
- As a registered and unauthorized user, I want to be able to log in to the website via a log-in form.
- When I'm on the `/login` page:
  - I would like to be able to enter my email and password on a clearly laid out form.
  - When I enter invalid data on the log-up form:
    - I would like the website to inform me of the validations I failed to pass and repopulate the form with my valid entries (except my password), so that I can try again without needing to refill forms I entered valid data into.

### Demo User
- As an unregistered and unauthorized user, I would like an easy-to-find and clear button on both the `/signup` and `/login` pages to allow me to visit the site as a guest without signing up or logging in.
- When I'm on either the `/signup` or `/login` pages:
  - I can click on a Demo User button to log me in and allow me access as a normal user, so that I can test the site's features and functionality without needing to stop and enter credentials.

### Log Out
- As a logged-in user, I want to log out via an easy-to-find log out button on the navigation bar.
- While on any page of the site:
  - I can log out of my account and be redirected to the landing change.
  - So that I can easily log out to keep my information secure.


## Businesses
> Create, Read, Update, Delete
### Creating a Business
- As a logged-in user, I want to be able to create a new Business by providing relevant information such as name, address, category, location, etc.
- When I'm on any page I can click a button to redirect me to `/business/new` page to create a new business:
  - I can create and submit a new Business.
  - I can add Menu Items and Images (Optional).
  - I can specify Hours of Operation.
  - I can specify Amenities (i.e. parking, Wi-Fi, wheelchair accessibility, etc.).

### Viewing a Business
- As a logged-in or logged-out user, I want to be able to view a selection of the spots.
- When I'm on the `/businesses` page:
  - I can view all the spots.
- As a logged-in or logged-out user, I want to be able to view a specific spot and its associated spot reviews and rating.
- When I'm on the `/business/:businessId` page:
  - I can view the content of the spot, as well as the associated reviews, menu items, and amenities.

### Updating a Business
- As a logged-in user, I want to be able to edit my spot by clicking an Edit button associated with the user-owned spot.
- When I'm on the `/business/:businessId`, or `/users/:id/businesses` pages:
  - I can click "Edit" to make permanent changes to the spot I have posted, so that I can fix any errors I make in my spot.

### Deleting a Business
- As a logged-in user, I want to be able to delete my Business by clicking a Delete button associated with the Business(s) that I own.
- When I'm on the `/business/:businessId`, or `/users/:id/businesses` pages:
  - I can click "Delete" to permanently delete a business I have listed.

## Review
> Create, Read, Update, Delete
### Create Review
- As a logged-in user, I want to be able to create a new review on a business by providing relevant information such as star rating, description, and photos.
- When I'm on the `/business/:businessId` page:
  - I can create and submit a new Review on that business.
  - I can add star rating, review description, and photos (optional).

### Viewing Reviews
- As a logged-in or logged-out user, I want to be able to view a selection of the reviews.
- When I'm on the `/business/:businessId` page:
  - I can view all the reviews.

### Updating a Review
- As a logged-in user, I want to be able to edit my review by clicking an Edit button associated with the user review.
- When I'm on the `/business/:businessId`, or `/users/:id/profile` pages:
  - I can click "Edit" to make permanent changes to the review I have posted, so that I can fix any errors I make in my review.

### Deleting a Review
- As a logged-in user, I want to be able to delete my review for a business by clicking a Delete button associated with the review(s) I’ve made.
- When I'm on the `/business/:businessId`, or `/users/:id/profile` pages:
  - I can click "Delete" to permanently delete a business I have listed.

## Menu
> Create, Read
### Creating a Menu
- As a logged-in user, I want to be able to create a new Menu by providing relevant information.
  - Done on creation of a new business.

### Viewing a Menu
- As a logged-in or logged-out user, I want to be able to view a selection of the menu items.
  - When I'm on the `/business/:businessId/menu` page:
    - I can view all the menu items.

## Amenities
> Create, Read
### Creating Amenities
- As a logged-in user, I want to be able to create Amenities by providing relevant information.
  - Done on creation of a new business.

### Viewing Amenities
- As a logged-in or logged-out user, I want to be able to view a selection of the amenities.
  - When I'm on the `/business/:businessId` page:
    - I can view all the amenities.
