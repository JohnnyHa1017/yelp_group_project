from app.models import db, ReviewImage, environment, SCHEMA
from sqlalchemy.sql import text


def seed_review_images():
    review1_img = ReviewImage(review_id=1, url="https://i.postimg.cc/mkgNs9hT/torchic-rice-omlet.png")
    review2_img = ReviewImage(review_id=2, url="https://i.postimg.cc/cJdv2SvS/chikorita-bruschetta.png")
    review3_img = ReviewImage(review_id=3, url="https://i.postimg.cc/KzSQT4j2/stardew-salad.png")
    review4_img = ReviewImage(review_id=4, url="https://i.postimg.cc/jdwWpcvM/stardew-pink-cake.png")
    review5_img = ReviewImage(review_id=5, url="https://i.postimg.cc/Hxfn0ShJ/hunter-img1.png")
    review6_img = ReviewImage(review_id=6, url="https://i.postimg.cc/Bbqyz3yR/hunter-img2.png")
    review7_img = ReviewImage(review_id=7, url="https://i.postimg.cc/TPH3fRnM/continential-img-1.png")
    review8_img = ReviewImage(review_id=8, url="https://i.postimg.cc/mgpsFmk7/continential-img2.png")
    review9_img = ReviewImage(review_id=9, url="https://i.postimg.cc/Pq2R99W7/baratie-img1.png")
    review10_img = ReviewImage(review_id=10, url="https://i.postimg.cc/6qnskz5G/baratie-img2.png")
    review11_img = ReviewImage(review_id=11, url="https://i.postimg.cc/qqBr3SsX/cafe-leblanc-img1.png")
    review12_img = ReviewImage(review_id=12, url="https://i.postimg.cc/28BcxT04/cafe-leblanc-img2.png")
    review13_img = ReviewImage(review_id=13, url="https://i.postimg.cc/6qymMmsX/urahara-img1.png")
    review14_img = ReviewImage(review_id=14, url="https://i.postimg.cc/FzMDDFgy/urahara-img2.png")
    review15_img = ReviewImage(review_id=15, url="https://i.postimg.cc/KY7STwbp/horseman-img1.png")
    review16_img = ReviewImage(review_id=16, url="https://i.postimg.cc/QxvRyhxn/horseman-img2.png")
    review17_img = ReviewImage(review_id=17, url="https://i.postimg.cc/L6pTSRHb/ac-img1.png")
    review18_img = ReviewImage(review_id=18, url="https://i.postimg.cc/ZKHrhdsW/ac-img2.png")
    review19_img = ReviewImage(review_id=19, url="https://i.postimg.cc/1RwdDsJ9/Screenshot-2024-04-12-at-9-47-17-AM.png")
    review20_img = ReviewImage(review_id=20, url="https://i.postimg.cc/KvrvpXvb/ponyo-img2.png")

    db.session.add_all(
        [
            review1_img,
            review2_img,
            review3_img,
            review4_img,
            review5_img,
            review6_img,
            review7_img,
            review8_img,
            review9_img,
            review10_img,
            review11_img,
            review12_img,
            review13_img,
            review14_img,
            review15_img,
            review16_img,
            review17_img,
            review18_img,
            review19_img,
            review20_img,
        ]
    )
    db.session.commit()


def undo_review_images():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.review_images RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM review_images"))

    db.session.commit()
