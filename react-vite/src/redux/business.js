// Action Creators
export const GET_ALL_DATA = 'business/GET_ALL_DATA'
export const GET_ONE_BUSINESS = 'business/GET_ONE_BUSINESS'
export const CREATE_NEW_BUSINESS = 'business/CREATE_NEW_BUSINESS'
export const UPDATE_BUSINESS = 'business/UPDATE_BUSINESS'
export const DELETE_BUSINESS = 'business/DELETE_BUSINESS'
export const CREATE_NEW_AMENITY = 'business/CREATE_AMENITY'
export const CREATE_BUSINESS_IMAGE = 'busines/CREATE_IMAGE'

// Action Types
const getAllData = (data) => {
    return {
        type: GET_ALL_DATA,
        data
    }
}

const getOneBusiness = (data) => {
    return {
        type: GET_ONE_BUSINESS,
        data
    }
}

const createNewBusiness = (data) => {
    return {
        type: CREATE_NEW_BUSINESS,
        data
    }
}

const updateBusiness = (data) => {
    return {
        type: UPDATE_BUSINESS,
        data
    }
}

const deleteBusiness = (data) => {
    return {
        type: DELETE_BUSINESS,
        data
    }
}

const createAmenity = (data) => {
    return {
        type: CREATE_NEW_AMENITY,
        data
    }
}

const createBusinessImage = (data) => {
    return{
        type: CREATE_BUSINESS_IMAGE,
        data
    }
}

// Landing Page Thunk
export const landingPageThunk = () => async (dispatch) => {
    const response = await fetch('/api')

    if (!response.ok) {
        throw new Error('Failed to fetch data')
    }

    const all_data = await response.json()

    if (all_data.errors) {
        return all_data.errors;
    }

    dispatch(getAllData(all_data))
    return all_data
}

// Get Specific Business Thunk
export const specificBusinessThunk = (businessId) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId}`)

    if (!response.ok) {
        throw new Error('Failed to fetch specific business.')
    }

    const one_data = await response.json()

    // console.log("ONE_DATA IN SPECIFIC BUSINESS THUNK", one_data)
    // !: THIS IS AN OBJECT OF TWO OBJECTS NAMED 'Business', 'Business_Images'
    // ?: THIS HOLDS OBJECT BUSINESS {  DETAILS  }
    // ?: AS WELL AS OBJECT BUSINESS_IMAGES NESTING AN ARRAY OF [{  IMAGES_DETAILS  }]

    if (one_data.errors) {
        return one_data.errors
    }

    dispatch(getOneBusiness(one_data.Business))
    return one_data
}

// Get Business Menu Thunk
export const businessMenuThunk = (businessId) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId}/menu`)

    if (!response.ok) {
        throw new Error('Failed to fetch menu.')
    }

    const menu_data = await response.json()

    console.log('MENU_DATA IN BUSINESS.JS THUNKS', menu_data)
    // !: THIS IS AN OBJECT OF TWO OBJECTS NAMED 'Business_Images', 'Menu'
    // ??: THIS IS AN OBJECT NAMED MENU NESTING AN ARRAY OF [{  MENU_ITEMS  }]
    // ?: AS WELL AS OBJECT BUSINESS_IMAGES NESTING AN ARRAY OF [{  IMAGES_DETAILS  }]

    if (menu_data.errors) {
        return menu_data.errors
    }

    dispatch(getAllData(menu_data))
    return menu_data
}

// Get Business Amenities Thunk (Business Id)
export const businessAmenitiesThunk = (businessId) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId}/amenity`)

    if (!response.ok) {
        throw new Error('Failed to fetch menu.')
    }

    const amenity_data = await response.json()
    if (amenity_data.errors) {
        return amenity_data.errors
    }

    dispatch(getAllData(amenity_data))
    return amenity_data
}

// Create Business Amenities Thunk
export const createNewAmenitiesThunk = (businessId, newAmenity) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId}/amenity/new`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newAmenity)
    })
    if(response.ok){
        const data = await response.json()
        dispatch(createAmenity(data.amenity))
        return data
    }
}

// Create New Business Thunk
export const createNewBusinessThunk = (newBusiness) => async (dispatch) => {
    const response = await fetch('/api/business/new', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newBusiness)
    })

    if (response.ok) {

        const data = await response.json()
        dispatch(createNewBusiness(data))
        return data
    }else{
        const error = await response.json()
        return error
    }
}

// Update Business Thunk (Business Id)
export const updateBusinessThunk = (business, businessId) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId}/edit`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(business)
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(updateBusiness({...business, ...data}))
        return data
    }

    if (!response.ok) {
        throw new Error('Failed to update business.')
    }
}

// Delete Business Thunk (Business Id)
export const deleteBusinessThunk = (businessId) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId.id}/delete`, {
        method: "DELETE"
    })

    if (response.ok) {
        const data = await response.json()
        dispatch(deleteBusiness(data))
    }
}

// Get Business Images Thunk
export const getBusinessImagesThunk = () => async(dispatch) => {
    const response = await fetch(`/api/business/businesses`)
    if(!response.ok){
        throw new Error('Failed to fetch all business and business images')
    }
    const data = await response.json()
    dispatch(getAllData(data))
    return data
}

export const createBusinessImageThunk = (businessId, newImage) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessId}/images`, {
        method: 'POST',
        body: newImage
    })
    if(!response.ok){
        throw new Error('Failed to create new image.')
    }
    const data = await response.json()
    dispatch(createBusinessImage(data))
    return data
}

export const updateBusinessImageThunk = (businessImageId, updateImage) => async (dispatch) => {
    const response = await fetch(`/api/business/${businessImageId}/edit/images`, {
        method: 'PUT',
        body: updateImage
    })
    if(!response.ok){
        throw new Error('Failed to update new image.')
    }
    const data = await response.json()
    dispatch(createBusinessImage(data))
    return data
}

function businessReducer(state = {}, action) {
    switch (action.type) {
        case GET_ALL_DATA: {
            return { ...state, ...action.data }
        }
        case GET_ONE_BUSINESS: {
            return { ...state, [ action.data.id ]: action.data }
        }
        case CREATE_NEW_BUSINESS: {
            return { ...state, ...action.data }
        }
        case UPDATE_BUSINESS: {
            return { ...state, ...action.data }
        }
        case DELETE_BUSINESS: {
            const deleteState = {...state}
            delete deleteState[action.data]
            return deleteState
        }
        case CREATE_NEW_AMENITY: {
            return {...state, ...action.data}
        }
        case CREATE_BUSINESS_IMAGE:{
            return {...state, ...action.data}
        }
        default:
            return state
    }
}

export default businessReducer
