import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteReviewThunk } from '../../redux/reviews'

import './DeleteReview.css'

const DeleteReview = ()=>{
    const { reviewId, businessId } = useParams()
    const nav = useNavigate()
    const dispatch = useDispatch()
    const onDelete = (e) => {
        e.preventDefault()
        dispatch(deleteReviewThunk(reviewId))
        nav(`/business/${businessId}`)
    }

    // Go back in the history
    const onKeep = () => {
        nav(-1)
    }

    return (
        <>
        <div className='Delete-buttons-container'>
            <h3>Are You Sure ?</h3>
        <button className = "DeleteReview-btn" onClick={onDelete}>
                Yes (Delete Review)
            </button>
            <button className = 'Dont-DeleteReview-btn' onClick={onKeep}>
                No (Go Back)
            </button>
        </div>
        </>
    )
}

export default DeleteReview
