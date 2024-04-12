import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { landingPageThunk } from '../../redux/business'
import { NavLink } from 'react-router-dom';
// import { useModal } from "../../context/Modal";
// import { landingPageThunk } from '../../redux/business'
// import { SignupFormModal } from '../SignupFormModal'
// import { LoginFormModal } from '../LoginFormModal'
// import { OpenModalButton } from '../OpenModalButton'
// import { ProfileButton } from '../Navigation'
import ImageCarousel from "../Carousel/Carousel";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { formatDistanceToNow } from 'date-fns';
import { SiYelp } from "react-icons/si";
import default_business_background from '../../images/default_business_background.jpg'


import './LandingPage.css'

export default function LandingPage() {

    const dispatch = useDispatch()
    const data = useSelector((state) => state.business)
    const reviewsArray = data.Review


    useEffect(() => {
        dispatch(landingPageThunk())
    }, [dispatch])

    if (!data || !data.Review || !data.Business || !data.Users) {
        return <div>Loading...</div>
    }

    // 6 reviews on landing
    const sixreviews = []
    for (let i = 0; i < 6; i++) {
        sixreviews.push(reviewsArray[i])
    }

    const allBusiness = Object.values(data.Business)

    // console.log('@@@@@=>', allBusiness)
    // console.log('sixereviews', sixreviews)
    // Helper func: Business avg star rating by id
    function businessAvgRating(businessId) {
        let avgRating = 0
        let numRev = 0
        for (let review of reviewsArray) {
            if (review.business_id == businessId) {
                numRev++
                avgRating += review.star
            }
        }
        return avgRating / numRev
    }
    function numReview(businessId) {
        let numRev = 0
        for (let review of reviewsArray) {
            if (review.business_id == businessId) {
                numRev++
            }
        }
        return numRev
    }
    //render stars
    function renderStars(starValue) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= starValue) {
                stars.push(<span key={i} className="star-filled">★</span>);
            } else {
                stars.push(<span key={i} className="star-empty">☆</span>);
            }
        }
        return stars
    }
    //formatdates
    // function formatDate(date) {
    //     const newDate = new Date(date)
    //     const options = { month: 'long', day: 'numeric', year: 'numeric' }
    //     return newDate.toLocaleDateString(undefined, options)
    // }

    //X minutes ago (package)
    function formatTimeAgo(date) {
        const time = new Date(date);
        return formatDistanceToNow(time, { addSuffix: true });
    }

    //render $$$
    function renderPriceRating(priceRating) {
        switch (priceRating) {
            case 1:
                return <BiSolidBadgeDollar />;
            case 2:
                return (
                    <>
                        <BiSolidBadgeDollar />
                        <BiSolidBadgeDollar />
                    </>
                );
            case 3:
                return (
                    <>
                        <BiSolidBadgeDollar />
                        <BiSolidBadgeDollar />
                        <BiSolidBadgeDollar />
                    </>
                );
            case 4:
                return (
                    <>
                        <BiSolidBadgeDollar />
                        <BiSolidBadgeDollar />
                        <BiSolidBadgeDollar />
                        <BiSolidBadgeDollar />
                    </>
                );
            default:
                return null;
        }dedefauly
    }

    function prevImg(images){
        const preview = images.filter(img => img.preview == true)
        if(!preview.length){
            return default_business_background
        }
        return preview[0].url
    }

    for(let rev of sixreviews){
        console.log(rev.reviewImages, 'review in 6 revies')
    }

    return (
        <>
            <div style={{ marginBottom: '500px' }}>
                <div className='carousel-container'>
                    <ImageCarousel className='img-carousel'/>
                </div>
            </div>
            <div>
                <h1>Select a business</h1>
            </div>
            <div className='all-business-container'>

                {allBusiness.map(business => {
                    // const categories = Array.isArray(business.category) ? business.category : JSON.parse(business.category);
                    return (
                        <NavLink to={`/business/${business.id}`} className='business-card' key={business.id}>
                            <h2 className="landing-card-title">{business.title}</h2>
                            <img src={prevImg(business.businessImages)} className='landing-card-image'/>
                            <p className="landing-price-rating">{renderPriceRating(business.price_rating)}</p>
                            <p><span className="landing-card-titles">Phone Number:</span> {business.phone_number}</p>
                            <p><span className="landing-card-titles">Country:</span> {business.country}
                            <p></p><span className="landing-card-titles">State:</span> {business.state} <span className="landing-card-titles">City:</span> {business.city}</p>
                            <p><span className="landing-card-titles">Address:</span> {business.address}</p>
                            <p><span className="landing-card-titles">Categories:</span> {business.category.split('"')}</p>
                            <div><span className="landing-card-About">About:</span></div>
                            <p className="landing-card-description">{business.description}</p>
                        </NavLink>
                    );
                })}
            </div>

            <div className='recent-activity-container'>
                <h2 className='recent-actity-text'>Recent Activity</h2>
                <div className='recent-reviews'>
                    {sixreviews.map(review => (
                        <NavLink to={`/business/${data?.Business[review?.business_id]?.id}`} className='landing-business-review-container' key={review.id}>
                            <div className='review-user'>
                                <p>{data.Users[review.user_id].first_name} wrote a review <SiYelp className='munch-logo-review' /></p>
                                <p className='timeago'>{formatTimeAgo(review.createdAt)}</p>
                            </div>
                            <hr className='landing-hr'></hr>
                            <div className='landing-business-container'>
                                <p className='landing-business-name'>{data?.Business[review?.business_id]?.title}</p>
                                <div className='landing-business-rating'>
                                    {renderStars(businessAvgRating(data?.Business[review?.business_id]?.id))}
                                    <span> {numReview(data?.Business[review?.business_id]?.id)}</span>
                                </div>
                                <p className='landing-business-price-rating'>
                                    {renderPriceRating(data?.Business[review?.business_id]?.price_rating)} <span className='price-rating-dot'>&middot;</span>
                                    <span>
                                        {Array.isArray(data?.Business[review?.business_id]?.category)
                                            ? data?.Business[review?.business_id]?.category.join(', ')
                                            : JSON.parse(data?.Business[review?.business_id]?.category).join(', ')
                                        }
                                    </span>
                                </p>
                                <img src='data?.Business[review?.business_id]?.url' alt='' />
                            </div>
                            {/* <p className='review-description'>{review.review}</p>
                            <p className='review-image'>{review.image}</p> */}
                        </NavLink>
                    ))}
                </div>
                <hr className='hr'></hr>
                <div className='landing-categories'>
                    <h2 className='landing-categories-text'>Categories</h2>
                    <div className='landing-category-container'>
                        <NavLink to='category/Cafe' className='landing-category'>
                            <p>Cafe</p>
                        </NavLink>
                        <NavLink to='category/Japanese' className='landing-category'>
                            <p>Japanese</p>
                        </NavLink>
                        <NavLink to='category/Italian' className='landing-category'>
                            <p>Italian</p>
                        </NavLink>
                        <NavLink to='category/Bar' className='landing-category'>
                            <p>Bar</p>
                        </NavLink>
                        <NavLink to='category/Seafood' className='landing-category'>
                            <p>Seafood</p>
                        </NavLink>
                        <NavLink to='category/German' className='landing-category'>
                            <p>German</p>
                        </NavLink>
                        <NavLink to='category/Asian Fusion' className='landing-category'>
                            <p>Asian Fusion</p>
                        </NavLink>
                        <NavLink to='category/Dessert' className='landing-category'>
                            <p>Dessert</p>
                        </NavLink>
                    </div>
                </div>
            </div>
        </>

    )
}
