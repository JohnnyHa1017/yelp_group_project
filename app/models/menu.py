from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship

class Menu(db.Model):
    __tablename__ = 'menus'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = Column(Integer, primary_key=True)
    business_id = Column(Integer, ForeignKey(add_prefix_for_prod('businesses.id')), nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(db.Enum('Appetizer', 'Entree', 'Drink', 'Dessert', 'Specials', name='category'), nullable=False)
    price = Column(Float(precision=2))
    description = Column(String(2000))
    # image = Column(String(500), nullable=True)

    businesses = relationship('Business', back_populates='menus')
    business_images = relationship('BusinessImage', back_populates='menus', cascade='all, delete-orphan')

    # @property
    # def menu_img(self):
    #     return [image.to_dict for image in self.business_images]

    def to_dict(self):
        return {
            'id': self.id,
            'business_id': self.business_id,
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'description': self.description,
            # 'menuImages': self.menu_img
        }
