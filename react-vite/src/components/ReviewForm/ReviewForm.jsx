import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom'
import { createReviewImageThunk, createReviewThunk, updateReviewImageThunk } from '../../redux/reviews'
import { updateReviewThunk } from '../../redux/reviews'
import './ReviewForm.css'

const CreateNewReview = ({ buttonName, reviewToUpdate }) => {
    const dispatch = useDispatch()
    const { businessId, reviewId } = useParams()
    const user = useSelector((state) => state.session.user)
    const reviews = useSelector(state => state.reviews)
    const nav = useNavigate()
    let currRevImg = reviews?.ReviewImage?.find(rev => rev.id == reviewId)
    const [review, setReview] = useState(reviewToUpdate?.review)
    const [star, setStars] = useState(reviewToUpdate?.star ?? null)
    const [image, setImage] = useState(currRevImg?.url); //reviewToUpdate?.image ?? null
    const [imageLoading, setImageLoading] = useState(false);
    const [validations, setValidations] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [hover, setHover] = useState(null)


    useEffect(() => {
        if (!user) {
            nav('/')
        }
    }, [user, submitted])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitted(true)


        if (review.length <= 15 || star < 1) {
            setValidations({
                ...validations,
            })
            return
        }
        // await Promise.resolve(formData);

        const reviewObj = {
            review, star, image
        }
        if (!reviewId) {
            const newReview = {
                review, star
            }
            try {
                const newRev = await dispatch(createReviewThunk(businessId, newReview))
                const formData = new FormData();
                formData.append("url", image);
                formData.append('review_id', newRev.id)
                setImageLoading(true);
                if (image) {
                    await dispatch(createReviewImageThunk(newRev.id, formData))
                }
                nav(`/business/${businessId}`);
            } catch (error) {
                setValidations({ ...validations, message: 'Cannot add review' })
                // console.error("Error creating review:", error);
            }
        } else {
            const updateReview = await dispatch(updateReviewThunk(reviewObj, reviewId))
            if (updateReview && image) {
                const formData = new FormData()
                formData.append('url', image)
                formData.append('review_id', reviewId)

                if (!currRevImg) {
                    await dispatch(createReviewImageThunk(reviewId, formData))
                    setImageLoading(true)
                } else {
                    await dispatch(updateReviewImageThunk(currRevImg?.id, formData))
                    setImageLoading(true)
                }
            }
        }
        nav(`/business/${businessId}`)
    }


    return (
        <>
            <div className='review-form'>
                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="review-form-container"
                >
                    {submitted && validations && validations.message && <p>{validations.message}</p>}
                    <h3 className='review-form-h3'>Select a star rating</h3>
                    <div className='Stars-field'>
                        {[1, 2, 3, 4, 5].map((star, i) => {
                            const ratingValue = i + 1;
                            return (
                                <label key={i}>
                                    <span
                                        className='Stars'
                                        onClick={() => setStars(ratingValue)}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(ratingValue)}
                                    >
                                        {ratingValue <= (hover || star) ? '★' : '☆'}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                    <h3 className='review-form-h3'>Add your review</h3>
                    <textarea
                        className='review-textarea'
                        type='text'
                        name='review'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder='Leave your review here...'
                        rows={7}
                        cols={70}
                    />
                    {(submitted && review.length <= 15) && (
                        <p style={{ color: 'red' }}>Your review must be greater than 15 characters</p>
                    )}
                    {(submitted && star < 1) && (
                        <p style={{ color: 'red' }}>You must select a star rating</p>
                    )}
                    <h3 className='review-form-h3'>Include a photo</h3>
                    <label>
                        <input
                            type='file'
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        ></input>
                    </label>
                    {(imageLoading) && <p>Loading...</p>}
                    {validations.image && (<p className='validation-err-text'>{validations.image}</p>)}
                    {image?.length > 0 && (
                        <label htmlFor="post-image-input" className="file-input-labels-noname"><img src={image} className="thumbnails-noname"></img></label>
                    )}
                    <div className='Review-Btn-container'>
                        <button type='submit' className='Review-Submit-btn' >{buttonName}</button>
                        {/* {(imageLoading) && <p>Loading...</p>} */}
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateNewReview
