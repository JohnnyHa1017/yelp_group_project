// Action Creators
export const GET_BUSINESS_REVIEWS = 'business/GET_BUSINESS_REVIEWS '
export const CREATE_REVIEW = 'business/CREATE_REVIEW'
export const UPDATE_REVIEW = 'business/UPDATE_REVIEW'
export const DELETE_REVIEW = 'business/DELETE_REVIEW'
export const ALL_REVIEW = 'review/ALL'
export const CREATE_REVIEW_IMAGE = '/review/CREATE_IMAGE'

// Action Types
const getAllReviews = (allReviews)=>{
    return{
        type: ALL_REVIEW,
        allReviews
    }
}

const getBusinessReviews = (reviews)=>{
    return{
        type: GET_BUSINESS_REVIEWS,
        reviews
    }
}

const createReview = (newReview)=>{
    return{
        type: CREATE_REVIEW,
        newReview
    }
}

const updateReview = (updatedReview)=>{
    console.log("updatedReview ==>", updatedReview)
    return {
        type: UPDATE_REVIEW,
        updatedReview
    }

}

const deleteReview = (reviewId)=>{
    return{
        type: DELETE_REVIEW,
        reviewId
    }

}

const createReviewImage = (review) => {
    return {
        type: CREATE_REVIEW_IMAGE,
        review
    }
}


// Review Thunks
export const allReviewThunk = () => async (dispatch) => {
    const response = await fetch('/api/reviews/all')

    console.log('response ==>', response)

    if (!response.ok) {
        throw new Error('Failed to fetch reviews.')
    }

    const all_data = await response.json()

    if (all_data.errors) {
        return all_data.errors;
    }

    dispatch(getAllReviews(all_data))
    return all_data
}


export const businessReviewThunk = (businessId) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId}/review`)

    if (!response.ok) {
        throw new Error('Failed to fetch reviews.')
    }

    const reviews = await response.json()

    if (reviews.errors) {
        return reviews.errors;
    }

    dispatch(getBusinessReviews(reviews))
    return reviews
}

export const createReviewThunk = (businessId, newReview) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId}/review/new`,{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newReview)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(createReview(data))
        return data

    } else{
        const error = await response.json()
        return error
    }
}

// Update Review Thunk
export const updateReviewThunk = (review, reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}/update`,{
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(updateReview({...review, ...data}))
        return data
    }
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}/delete`, {
        method: 'DELETE'
    })

    if (response.ok) {
        dispatch(deleteReview(reviewId))
    }
}

export const createReviewImageThunk = (reviewId, reviewImage) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}/images`, {
        method: 'POST',
        body: reviewImage
    })
    if(!response.ok){
        throw new Error('Failed to upload image.')
    }
    const data = await response.json()
    dispatch(createReviewImage(data))
    return data
}

//reducers
function reviewReducer(state={}, action){
    switch(action.type){
        case ALL_REVIEW:{
            return { ...state, ...action.allReviews}
        }
        case GET_BUSINESS_REVIEWS:{
            return { ...state, ...action.reviews}
        }
        case CREATE_REVIEW:{
            return { ...state, ...action.data}
        }
        case UPDATE_REVIEW:{

            return { ...state, ...action.updatedReview.reviews}
        }
        case DELETE_REVIEW:{
            const newState = { ...state }
            delete newState[action.reviewId]
            return newState
        }
        case CREATE_REVIEW_IMAGE: {
            return {...state, ...action.review}
        }
        default:
            return state
    }
}

export default reviewReducer
