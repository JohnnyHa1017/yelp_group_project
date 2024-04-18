import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { allReviewThunk } from '../../redux/reviews'

function AllReviews() {
    const dispatch = useDispatch()

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
