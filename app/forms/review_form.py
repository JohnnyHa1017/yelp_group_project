from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired, NumberRange
from flask_wtf.file import FileField, FileAllowed, FileRequired
from app.routes.aws_helpers import ALLOWED_EXTENSIONS
from app.models import Review


class CreateReview(FlaskForm):
    review = StringField('Review', validators=[DataRequired()])
    star = IntegerField('Star', validators=[DataRequired(), NumberRange(min=0, max=5, message='Star rating must be between 1 and 5')])
    # image = StringField('Image String')

class ReviewImageForm(FlaskForm):
    url = FileField("Image File", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
#     submit = SubmitField("Create Post")

