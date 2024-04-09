from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

class ReviewImage(db.Model):
    __tablename__ = 'review_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    review_id = Column(Integer, ForeignKey(add_prefix_for_prod('reviews.id')), nullable=False)
    url = Column(String)

    reviews = relationship('Review', back_populates='review_images')

    def to_dict(self):
        return {
            'id': self.id,
            'review_id': self.review_id,
            'url': self.url
        }
