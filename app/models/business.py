from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from .business_images import BusinessImage

class Business(db.Model):
  __tablename__ = 'businesses'

  if environment == "production":
    __table_args__ = {'schema': SCHEMA}

  id = Column(Integer, primary_key=True)
  owner_id = Column(Integer, ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
  title = Column(String(255), nullable=False)
  address = Column(String(255), nullable=False)
  city = Column(String(255), nullable=False)
  state = Column(String(255), nullable=False)
  country = Column(String(255), nullable=False)
  price_rating = Column(Integer, nullable=False)
  category = Column(String(255), nullable=False)
  lat = Column(Float)
  lng = Column(Float)
  phone_number = Column(String(25), nullable=False)
  description = Column(String(2000))
  schedule = Column(String(500), nullable=True)
  # image_url = Column(String)

  users = relationship('User', back_populates='businesses')
  menus = relationship('Menu', back_populates='businesses', cascade='all, delete-orphan')
  amenities = relationship('Amenity', back_populates='businesses', cascade='all, delete-orphan')
  reviews = relationship('Review', back_populates='businesses', cascade='all, delete-orphan')
  business_images = relationship('BusinessImage', back_populates='businesses', cascade='all, delete-orphan')

  @property
  def business_img(self):
    return[images.to_dict() for images in self.business_images]

  def to_dict(self):
    return {
      'id': self.id,
      'owner_id': self.owner_id,
      'title': self.title,
      'address': self.address,
      'city': self.city,
      'state': self.state,
      'country': self.country,
      'price_rating': self.price_rating,
      'category': self.category,
      'lat': self.lat,
      'lng': self.lng,
      'phone_number': self.phone_number,
      'description': self.description,
      'schedule':self.schedule,
      'businessImages': self.business_img
      # 'image_url': self.image_url
    }
