from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship

class BusinessImage(db.Model):
    __tablename__='buisness_images'

    if environment == "production":
        __table_args__={'schema':SCHEMA}

    id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey(add_prefix_for_prod('businesses.id')), nullable=False)
    url = Column(String(255))
    preview = Column(Boolean)

    businesses = relationship('Business', back_populates='buisness_images')

    def to_dict(self):
        return {
            'business_id': self.business_id,
            'url': self.url,
            'preview': self.preview
        }
