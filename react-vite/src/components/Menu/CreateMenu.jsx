import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createMenuThunk } from '../../redux/menu'
import { createBusinessImageThunk, specificBusinessThunk } from '../../redux/business'
import './Menu.css'


function CreateMenu() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const { businessId } = useParams()
    const user = useSelector((state) => state.session.user)
    const businessObj = useSelector((state) => state.business)

    console.log('businessObj[businessId] ==>', businessObj[businessId])

    let businessTitle = ''
    if (businessObj[businessId]) {
        businessTitle = businessObj[businessId].title
        console.log('businessTitle ==>', businessTitle)
    }

    useEffect(() => {
        dispatch(specificBusinessThunk(businessId))
    }, [dispatch, businessId])

    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [imageLoading, setImageLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [validations, setValidations] = useState('')
    const [submitted, setSubmitted] = useState(false)

    let isValidated = false

    useEffect(() => {
        const errors = {}
        // if (!user || user.id != businessObj[businessId].owner) {
        if (!user) {
            nav('/')
        }
        if (submitted) {
            if (!name || name.length > 50) {
                errors.name = 'Name is required and can only be under 50 characters'
            }
            if (!category || !['Drink', 'Appetizer', 'Entree', 'Dessert', 'Specials'].includes(category)) {
                errors.category = 'Menu category must be one of: Drink, Appetizer, Entree, Dessert, or Specials.'
            }
            if (!price || typeof price !== 'number') {
                errors.price = 'Price is required and must be a number'
            }
            if (price < 0) {
                errors.price = 'Price must be a positive number'
            }
            if (description.length > 2000) {
                errors.description = 'Description must be under 2000 characters'
            }
        }

        setValidations(errors)
        if (Object.keys(validations).length) {
            isValidated = true
        }
    }, [user, nav, name, category, price, submitted])


    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitted(true)
        const newMenu = {
            name, category, price, description
        }
        // if (!Object.keys(validations).length) {
        const menu = await dispatch(createMenuThunk(businessId, newMenu))
        const formData = new FormData();
        formData.append('url', image)
        formData.append('business_id', businessId)
        formData.append('menu_id', menu.id)
        formData.append('preview', false)

        setImageLoading(true)
        await dispatch(createBusinessImageThunk(businessId, formData))
        nav(`/business/${businessId}`)
        // }
    }

    return (
        <div className='create-menu-form-container'>
            <h1 className='create-menu-title'>Add an item to {businessTitle}&apos;s menu</h1>
            <form
                onSubmit={handleSubmit}
                className='create-menu-form'
                encType='multipart/form-data'
            >
                <h3 className='create-form-h3'>Menu information</h3>
                <p className='create-form-description'> What&apos;s the name of your menu item?</p>
                <label className='create-menu-label-container'>
                    Item Name :
                    <input
                        type='text'
                        name='name'
                        className="business-form-input"
                        value={name}
                        placeholder='Item name'
                        onChange={(e) => setName(e.target.value)}
                    ></input>
                </label>
                {validations.name && (<p className='validation-messages'>{validations.name}</p>)}
                <h3 className='create-form-h3'>Category</h3>
                <p className='create-form-description'>What&apos;s the category of your menu item?</p>
                <label className='create-menu-label-container'>
                    Food Category:
                    <select className="business-form-input"
                        onChange={(e) => setCategory(e.target.value)}>
                        <option value='' disabled selected hidden>Please select a category</option>
                        <option value='Appetizer' >Appetizer</option>
                        <option value='Drink' >Drink</option>
                        <option value='Entree' >Entree</option>
                        <option value='Dessert' >Dessert</option>
                        <option value='Specials' >Specials</option>
                    </select>
                </label>
                {validations.category && (<p className='validation-messages'>{validations.category}</p>)}
                <h3 className='create-form-h3'>select a price</h3>
                <p className='create-form-description'>How much does your menu item cost?</p>
                <label className='create-menu-label-container'>
                    price :
                    <input
                        type='text'
                        name='price'
                        className="business-form-input"
                        value={price}
                        placeholder='Price'
                        onChange={(e) => setPrice(e.target.value)}
                    ></input>
                </label>
                {validations.price && (<p className='validation-messages'>{validations.price}</p>)}
                <h3 className='create-form-h3'>Details</h3>
                <p className='create-form-description'>How would you describe your menu item?</p>
                <label className='create-menu-label-container'>
                    Description :
                    <textarea
                        type='text'
                        className='create-description-textarea'
                        name='description'
                        value={description}
                        placeholder='Description'
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </label>
                {validations.description && (<p className='validation-messages'>{validations.description}</p>)}
                <label>
                    <input
                        type='file'
                        accept="image/*"
                        className="business-form-file"
                        onChange={(e) => setImage(e.target.files[0])}
                    ></input>
                </label>
                {(imageLoading) && <p>Loading...</p>}
                {validations.image && (<p className='validation-err-text'>{validations.image}</p>)}
                <div className="bzns-submit-container">
                    <button className='bzns-submit-btn' type='submit' disabled={isValidated}>Create Menu</button>
                </div>
            </form>
        </div>
    )
}

export default CreateMenu
