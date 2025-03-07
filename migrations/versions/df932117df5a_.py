"""empty message

Revision ID: df932117df5a
Revises: 
Create Date: 2024-04-24 16:07:53.756659

"""
from alembic import op
import sqlalchemy as sa
import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA") 

# revision identifiers, used by Alembic.
revision = 'df932117df5a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('first_name', sa.String(length=20), nullable=False),
    sa.Column('last_name', sa.String(length=20), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('businesses',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('owner_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('address', sa.String(length=255), nullable=False),
    sa.Column('city', sa.String(length=255), nullable=False),
    sa.Column('state', sa.String(length=255), nullable=False),
    sa.Column('country', sa.String(length=255), nullable=False),
    sa.Column('price_rating', sa.Integer(), nullable=False),
    sa.Column('category', sa.String(length=255), nullable=False),
    sa.Column('lat', sa.Float(), nullable=True),
    sa.Column('lng', sa.Float(), nullable=True),
    sa.Column('phone_number', sa.String(length=25), nullable=False),
    sa.Column('description', sa.String(length=2000), nullable=True),
    sa.Column('schedule', sa.String(length=500), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('amenities',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('business_id', sa.Integer(), nullable=False),
    sa.Column('reservation', sa.Boolean(), nullable=True),
    sa.Column('delivery', sa.Boolean(), nullable=True),
    sa.Column('pickup', sa.Boolean(), nullable=True),
    sa.Column('vegetarian', sa.Boolean(), nullable=True),
    sa.Column('accepts_credit_card', sa.Boolean(), nullable=True),
    sa.Column('free_wi_fi', sa.Boolean(), nullable=True),
    sa.Column('street_parking', sa.Boolean(), nullable=True),
    sa.Column('good_for_groups', sa.Boolean(), nullable=True),
    sa.Column('outdoor_seating', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('menus',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('business_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('category', sa.Enum('Appetizer', 'Entree', 'Drink', 'Dessert', 'Specials', name='category'), nullable=False),
    sa.Column('price', sa.Float(precision=2), nullable=True),
    sa.Column('description', sa.String(length=2000), nullable=True),
    sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('reviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('business_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('review', sa.String(length=2000), nullable=False),
    sa.Column('star', sa.Integer(), nullable=False),
    sa.Column('createdAt', sa.DateTime(), nullable=True),
    sa.Column('updatedAt', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('business_images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('business_id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(), nullable=True),
    sa.Column('preview', sa.Boolean(), nullable=True),
    sa.Column('menu_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['business_id'], ['businesses.id'], ),
    sa.ForeignKeyConstraint(['menu_id'], ['menus.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('review_images',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('review_id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['review_id'], ['reviews.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###
    if environment == 'production' and SCHEMA:
        op.execute(f"ALTER Table users SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER Table businesses SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER Table amenities SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER Table business_images SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER Table menus SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER Table reviews SET SCHEMA {SCHEMA};")
        op.execute(f"ALTER Table review_images SET SCHEMA {SCHEMA};")

def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('review_images')
    op.drop_table('business_images')
    op.drop_table('reviews')
    op.drop_table('menus')
    op.drop_table('amenities')
    op.drop_table('businesses')
    op.drop_table('users')
    # ### end Alembic commands ###
