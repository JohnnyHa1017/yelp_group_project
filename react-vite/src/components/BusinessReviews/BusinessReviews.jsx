import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { businessReviewThunk } from '../../redux/reviews'
import { landingPageThunk } from '../../redux/business'
import { NavLink } from 'react-router-dom'
import { MdOutlineStarPurple500 } from "react-icons/md";
import { MdOutlineStarOutline } from "react-icons/md";
import './BusinessReviews.css'

function BusinessReviews({ isFullPage }) {
    const { businessId } = useParams()
    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.reviews.Review)
    const currUser = useSelector((state) => state.session.user)
    const users = useSelector((state) => state.business.Users)

    useEffect(() => {
        dispatch(businessReviewThunk(businessId))
        dispatch(landingPageThunk())
    }, [dispatch, businessId])


    //isOwnerofReview
    function ownReview(user_id) {
        return currUser && currUser.id === user_id
    }

    //format date
    function formatDate(date) {
        const newDate = new Date(date)
        const options = { month: 'long', day: 'numeric', year: 'numeric' }
        return newDate.toLocaleDateString(undefined, options)
    }

    //render stars
    function renderStars(starValue) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= starValue) {
                stars.push(<span key={i} className="star-filled"><MdOutlineStarPurple500 className='star-icons' /></span>);
            } else {
                stars.push(<span key={i} className="star-empty"><MdOutlineStarOutline className='star-icons' /></span>);
            }
        }
        return stars
    }

    return (
        <>
            {reviews && users ? (
                reviews.length > 0 ? (
                    reviews.slice().reverse().map((review, index) => (
                        <div className={`review-container ${isFullPage ? 'full' : ''}`} key={index}>
                            <div className="name-and-buttons">
                                <h3>{users[review.user_id - 1].first_name} {users[review.user_id - 1].last_name.charAt(0)}</h3>
                                {ownReview(review.user_id) && (
                                    <div className="buttons-container">
                                        <button className='Business-review-btns'> <NavLink to={`/business/${businessId}/${review.id}/update`} className='review-CRUD-btn'>Edit Review</NavLink></button>
                                        <button className='Business-review-del-btns'> <NavLink to={`/business/${businessId}/${review.id}/delete`} className='review-CRUD-del-btn'>Delete Review</NavLink></button>
                                    </div>
                                )}
                            </div>
                            <div className="BR-Rating_Date">
                                <p>{renderStars(review.star)}</p> <p>{formatDate(review.createdAt)}</p>
                            </div>
                            <p className="BR-Review_desc">{review.review}</p>
                            {review?.reviewImages?.length > 0 && (
                                <img className='review-img' src={review.reviewImages[0].url} />
                            )}
                        </div>
                    ))
                ) : (
                        <div className='BR-No_review'>
                            <h2>No Reviews Yet...</h2>
                            <h3>Be the first to leave a review!</h3>
                        </div>
                )
            ) : (
                <div>Loading...</div>
            )}
        </>
    )
}

export default BusinessReviews
