import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { landingPageThunk } from '../../redux/business'
import { NavLink } from 'react-router-dom';
import ImageCarousel from "../Carousel/Carousel";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { formatDistanceToNow } from 'date-fns';
import { SiYelp } from "react-icons/si";
import default_business_background from '../../images/default_business_background.jpg'
import cafe from '../../images/cafe.png'
import japanese from '../../images/japanese.png'
import german from '../../images/german.png'
import italian from '../../images/italian.png'
import bar from '../../images/bar.png'
import dessert from '../../images/dessert.png'
import fusion from '../../images/fusion.png'
import seafood from '../../images/seafood.png'

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
                stars.push(<span key={i} className="l-star-filled l-star-icon">★</span>);
            } else {
                stars.push(<span key={i} className="l-star-empty l-star-icon">☆</span>);
            }
        }
        return stars
    }

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
        }
    }

    function prevImg(images){
        const preview = images.filter(img => img.preview == true)
        if(!preview.length){
            return default_business_background
        }
        return preview[0].url
    }

    // for(let rev of sixreviews){
    //     console.log(rev.reviewImages, 'review in 6 revies')
    // }

    function formatDescription(description){
        let newDescription = description?.slice(0,150)
        if(description.length > 150){
            newDescription += '...'
        }
        return newDescription
    }

    return (
        <>
            <div style={{ marginBottom: '500px' }}>
                <div className='carousel-container'>
                    <ImageCarousel className='img-carousel'/>
                </div>
            </div>
            <div>
            <h2 className='recent-actity-text'>Businesses</h2>
            </div>
            <div className='all-business-container'>
                {allBusiness.map(business => {
                    // const categories = Array.isArray(business.category) ? business.category : JSON.parse(business.category);
                    return (
                        <NavLink to={`/business/${business.id}`} className='business-card' key={business.id}>
                            <h2 className="landing-card-title">{business.title}</h2>
                            <hr className='hr-line'></hr>
                            <img src={prevImg(business.businessImages)} className='landing-card-image'/>
                            <hr className='hr-line'></hr>
                            <p>{renderStars(businessAvgRating(business?.id))}</p>
                            <p className="landing-price-rating">{renderPriceRating(business.price_rating)}</p>
                            <p><span className="landing-card-titles"></span> {business.category.split('"')}</p>
                            <p className="landing-card-description">{formatDescription(business.description)}</p>
                        </NavLink>
                    );
                })}
            </div>
            <div className='recent-activity-container'>
                <hr className='landing-bar'></hr>
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
                            <p className='review-description'>{}</p>
                            <p className='review-image'>{}</p>
                        </NavLink>
                    ))}
                </div>
                <hr className='hr'></hr>
                <div className='landing-categories'>
                    <h2 className='landing-categories-text'>Categories</h2>
                    <div className='landing-category-container'>
                        <NavLink to='category/Cafe' className='landing-category'>
                            <img className='category-img' src={cafe}/>
                            <p>Cafe</p>
                        </NavLink>
                        <NavLink to='category/Japanese' className='landing-category'>
                            <img className='category-img' src={japanese}/>
                            <p>Japanese</p>
                        </NavLink>
                        <NavLink to='category/Italian' className='landing-category'>
                            <img className='category-img' src={italian}/>
                            <p>Italian</p>
                        </NavLink>
                        <NavLink to='category/Bar' className='landing-category'>
                            <img className='category-img' src={bar}/>
                            <p>Bar</p>
                        </NavLink>
                        <NavLink to='category/Seafood' className='landing-category'>
                            <img className='category-img' src={seafood}/>
                            <p>Seafood</p>
                        </NavLink>
                        <NavLink to='category/German' className='landing-category'>
                            <img className='category-img' src={german}/>
                            <p>German</p>
                        </NavLink>
                        <NavLink to='category/Asian Fusion' className='landing-category'>
                            <img className='category-img' src={fusion}/>
                            <p>Asian Fusion</p>
                        </NavLink>
                        <NavLink to='category/Dessert' className='landing-category'>
                            <img className='category-img' src={dessert}/>
                            <p>Dessert</p>
                        </NavLink>
                    </div>
                </div>
            </div>
        </>

    )
}
