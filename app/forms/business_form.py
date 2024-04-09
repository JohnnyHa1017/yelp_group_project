from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField, SelectField, BooleanField
from wtforms.validators import DataRequired, NumberRange, Length
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.routes.aws_helpers import ALLOWED_EXTENSIONS
from app.models import Business, business_images

class CreateBusiness(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    address = StringField('Address', validators=[DataRequired()])
    city = StringField('City', validators=[DataRequired()])
    state = StringField('State', validators=[DataRequired()])
    country = StringField('Country', validators=[DataRequired()])
    lat = IntegerField('Lat')
    lng = IntegerField('Lng')
    # image_url = FileField("Image File", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    price_rating = IntegerField('Price Rating', validators=[DataRequired(), NumberRange(min=1, max=4, message='Price rating must be between 1 and 4')])
    category = StringField('Category', validators=[DataRequired()])
    phone_number = StringField('Phone Number', validators=[DataRequired(), Length(min=10, max=20)])
    description = StringField('Description')

class ScheduleForm(FlaskForm):
    hours = ['12:00am', '1:00am', '2:00am', '3:00am', '4:00am', '5:00am', '6:00am','7:00am','8:00am','9:00a','10:00am', '11:00am','12:00pm',
            '1:00pm', '2:00pm','3:00pm','4:00pm','5:00pm','6:00pm','7:00pm','8:00pm','9:00pm','10:00pm','11:00pm', None]
    monday_open = SelectField(choices=hours, validators=[DataRequired()])
    monday_close = SelectField(choices=hours, validators=[DataRequired()])
    tuesday_open = SelectField(choices=hours, validators=[DataRequired()])
    tuesday_close = SelectField(choices=hours, validators=[DataRequired()])
    wednesday_open = SelectField(choices=hours, validators=[DataRequired()])
    wednesday_close = SelectField(choices=hours, validators=[DataRequired()])
    thursday_open = SelectField(choices=hours, validators=[DataRequired()])
    thursday_close = SelectField(choices=hours, validators=[DataRequired()])
    friday_open = SelectField(choices=hours, validators=[DataRequired()])
    friday_close = SelectField(choices=hours, validators=[DataRequired()])
    saturday_open = SelectField(choices=hours, validators=[DataRequired()])
    saturday_close = SelectField(choices=hours, validators=[DataRequired()])
    sunday_open = SelectField(choices=hours, validators=[DataRequired()])
    sunday_close = SelectField(choices=hours, validators=[DataRequired()])


class BusinessImageForm(FlaskForm):
    url = FileField("Image File", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    preview = BooleanField("Preview")
    menu_id = IntegerField("Menu ID")
