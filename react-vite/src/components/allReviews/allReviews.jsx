import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { allReviewThunk } from '../../redux/reviews'

function AllReviews() {
    const dispatch = useDispatch()
    const reviews = useSelector((state) => state.reviews.Review)
    const reviewsImages = useSelector((state) => state.reviews.ReviewImage)

    useEffect(() => {
        dispatch(allReviewThunk())
    }, [dispatch])


    return (
        <>
            <h1>allreviews</h1>
        </>
    )
}

export default AllReviews
