import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { businessReviewThunk } from '../../redux/reviews'
import { landingPageThunk } from '../../redux/business'
import { NavLink } from 'react-router-dom'

import './BusinessReviews.css'

function BusinessReviews() {
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
                stars.push(<span key={i} className="star-filled">★</span>);
            } else {
                stars.push(<span key={i} className="star-empty">☆</span>);
            }
        }
        return stars
    }

    return (
        <>
            {reviews && users ? (
                reviews.slice().reverse().map((review, index) => (
                    <div className='review-container' key={index}>
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
                        {/* {reviewImages?.find((image) => image.review_id === review.id) && (
                            <img src={reviewImages.find((image) => image.review_id === review.id).url} alt="Review Image" />
                        )} */}
                        {/* <hr /> */}
                    </div>
                ))
            ) : (
                <div className='BR-No_review'>Be the first to review</div>
            )}
        </>
    )
}

export default BusinessReviews
