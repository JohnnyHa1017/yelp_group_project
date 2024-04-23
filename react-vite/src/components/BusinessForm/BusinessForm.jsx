import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom'
import { createBusinessImageThunk, createNewBusinessThunk, updateBusinessImageThunk, updateBusinessThunk } from '../../redux/business'
import './BusinessForm.css'

const CreateNewBusiness = ({ buttonName, business }) => {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const user = useSelector((state) => state.session.user)
  const currBusiness = useSelector(state => state.business)
  const { businessId } = useParams()

  let exisiting_price_rating = ''
  if (business?.price_rating) {
    for (let i = 0; i < business?.price_rating; i++) {
      exisiting_price_rating += '$'
    }
  }

  const [title, setTitle] = useState(business?.title);
  const [address, setAddress] = useState(business?.address);
  const [city, setCity] = useState(business?.city);
  const [state, setState] = useState(business?.state);
  const [country, setCountry] = useState(business?.country);
  const [lat, setLat] = useState(business?.lat);
  const [lng, setLng] = useState(business?.lng);
  const [description, setDescription] = useState(business?.description);
  const [phone_number, setPhoneNumber] = useState(business?.phone_number);
  const [price_rating, setPrice] = useState(exisiting_price_rating);
  const [category, setCategory] = useState(business?.category);
  const [image, setImage] = useState(currBusiness[businessId]?.businessImages[0]?.url);
  const [imageLoading, setImageLoading] = useState(false);
  // const [preview, setPreview] = useState(false)
  const [validations, setValidations] = useState({})
  const [submitted, setSubmitted] = useState(false)

  let isValidated = false
  useEffect(() => {
    if (!user) {
      nav('/')
    }
    const errors = {}
    if (submitted) {
      if (!title || (title.length > 50)) {
        errors.title = 'Title is required and can only be under 50 characters.'
      }
      if (!address || (address.length > 50)) {
        errors.address = 'Address is required and can only be under 50 characters.'
      }
      if (!city || city.length > 50) {
        errors.city = 'City is required and can only be under 50 characters.'
      }
      if (!state || (state.length > 50)) {
        errors.state = 'State is required and can only be under 50 characters.'
      }
      if (!country || (country.length > 50)) {
        errors.country = 'Country is required and can only be under 50 characters.'
      }
      if (!lat || (lat >= 90) || (lat <= -90)) {
        errors.lat = 'Latitude must be a number between -90 and 90.'
      }
      if (isNaN(lat) && lat.length > 1) {
        errors.lat_int = 'Latitude can only contain numbers.'
      }
      if (!lng || (lng >= 180) || (lng <= -180)) {
        errors.lng = 'Longitude must be between -180 and 180.'
      }
      if (isNaN(lng) && lng.length > 1) {
        errors.lng_int = 'Longitude can only contain numbers.'
      }
      if (!description || (description.length > 2000)) {
        errors.description = 'Description is required and must be 2000 characters or less.'
      }
      if (phone_number.length > 20) {
        errors.phone_number = "Phone Number cannot be more than 20 characters."
      }
      if (phone_number.length < 10) {
        errors.phone_number_min = 'Phone Number must be at least 10 digits.'
      }
      const numberChars = '1234567890-()'
      for (let char of phone_number) {
        if (!numberChars.includes(char)) {
          errors.phone_number_int = 'Phone Number must only contain numbers.'
        }
      }
      if (!price_rating) {
        errors.price_rating = "Price Rating is required."
      }
      if (price_rating !== '$' && price_rating !== '$$' && price_rating !== '$$$' && price_rating !== '$$$$') {
        errors.price_range = 'Price rating must be between $ and $$$$.'
      }
      if (!category) {
        errors.category = 'At least one category must be selected.'
      }
    }

    setValidations(errors)
    if (Object.keys(validations).length) {
      isValidated = true
    }
  }, [submitted, title, address, city, state, country, lat, lng, description, phone_number, price_rating, category, image]
  )

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);


    let createSchedule = ''

    let business = {
      title,
      address,
      city,
      state,
      country,
      description,
      phone_number,
      price_rating: price_rating.length,
      lat,
      lng,
      category,
      schedule: createSchedule,
      // image
    };

    // await Promise.resolve(formData);


    if (!businessId) {
      const createBusiness = await dispatch(createNewBusinessThunk(business));
      if (createBusiness && createBusiness.id) {
        const formData = new FormData();
        formData.append("url", image);
        formData.append('preview', true)
        formData.append('business_id', createBusiness.id)
        await dispatch(createBusinessImageThunk(createBusiness.id, formData))
        setImageLoading(true);
        nav(`/business/${createBusiness.id}`);
      }
    } else {
      const updateBusiness = await dispatch(updateBusinessThunk(business, businessId));
      if (updateBusiness) {
        const formData = new FormData();
        formData.append("url", image);
        formData.append('preview', true)
        formData.append('business_id', businessId)
        await dispatch(updateBusinessImageThunk(currBusiness[businessId]?.businessImages[0]?.id, formData))
        setImageLoading(true);
        nav(`/business/${businessId}`);
      }
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className='business-form'
    >
      <h3 className='create-form-h3'>Business Information</h3>
      <p className='create-form-description'>What&apos;s your name and where can we reach you?</p>
      <label>
        Business Name :
        <input
          className="business-form-input"
          type='text'
          name='title'
          value={title}
          placeholder='Name'
          onChange={(e) => setTitle(e.target.value)}
        ></input>
      </label>
      {validations.title && (<p className='validation-err-text'>{validations.title}</p>)}
      <label>
        Business Phone Number :
        <input
          type='text'
          name='phone number'
          className="business-form-input"
          value={phone_number}
          placeholder='Phone Number'
          onChange={(e) => setPhoneNumber(e.target.value)}
        ></input>
      </label>
      {validations.phone_number && (<p className='validation-err-text'>{validations.phone_number}</p>)}
      {validations.phone_number_min && (<p className='validation-err-text'>{validations.phone_number_min}</p>)}
      {validations.phone_number_int && (<p className='validation-err-text'>{validations.phone_number_int}</p>)}
      <hr className='create-form-line'></hr>
      <h3 className='create-form-h3'>Location</h3>
      <p className='create-form-description'>Where is your business located?</p>
      <label>
        Address :
        <input
          type='text'
          name='address'
          className="business-form-input"
          value={address}
          placeholder='Address'
          onChange={(e) => setAddress(e.target.value)}
        ></input>
      </label>
      {validations.address && (<p className='validation-err-text'>{validations.address}</p>)}
      <label>
        City :
        <input
          type='text'
          name='city'
          className="business-form-input"
          value={city}
          placeholder='City'
          onChange={(e) => setCity(e.target.value)}
        ></input>
      </label>
      {validations.city && (<p className='validation-err-text'>{validations.city}</p>)}
      <label>
        State :
        <input
          type='text'
          name='state'
          className="business-form-input"
          value={state}
          placeholder='State'
          onChange={(e) => setState(e.target.value)}
        ></input>
      </label>
      {validations.state && (<p className='validation-err-text'>{validations.state}</p>)}
      <label>
        Country :
        <input
          type='text'
          name='country'
          value={country}
          className="business-form-input"
          placeholder='Country'
          onChange={(e) => setCountry(e.target.value)}
        ></input>
      </label>
      {validations.country && (<p className='validation-err-text'>{validations.country}</p>)}
      <label>
        Latitude :
        {/* <span className='optional-tag'> required</span> */}
        <input
          type='text'
          name='lat'
          value={lat}
          className="business-form-input"
          placeholder='Latitude'
          onChange={(e) => setLat(e.target.value)}
        ></input>
      </label>
      {validations.lat && (<p className='validation-err-text'>{validations.lat}</p>)}
      {validations.lat_int && (<p className='validation-err-text'>{validations.lat_int}</p>)}
      <label>
        Longitude :
        {/* <span className='optional-tag'> required</span> */}
        <input
          type='text'
          name='lng'
          value={lng}
          className="business-form-input"
          placeholder='Longitude'
          onChange={(e) => setLng(e.target.value)}
        ></input>
      </label>
      {validations.lng && (<p className='validation-err-text'>{validations.lng}</p>)}
      {validations.lng_int && (<p className='validation-err-text'>{validations.lng_int}</p>)}
      <hr className='create-form-line'></hr>
      <h3 className='create-form-h3'>Select a price rating</h3>
      <p className='create-form-description'>What is the price range of your business?</p>
      <label>
        Price :
        <select
          className="business-form-input"
          value={price_rating}
          placeholder="$"
          onChange={(e) => setPrice(e.target.value)}
        >
          <option value='' disabled selected hidden>Please select a price rating</option>
          <option value='$'>$</option>
          <option value='$$'>$$</option>
          <option value='$$$'>$$$</option>
          <option value='$$$$'>$$$$</option>
        </select>
      </label>
      {validations.price_rating && (<p className='validation-err-text'>{validations.price_rating}</p>)}
      {validations.price_range && (<p className='validation-err-text'>{validations.price_range}</p>)}
      <hr className='create-form-line'></hr>
      <h3 className='create-form-h3'>Tell us about your business</h3>
      <p className='create-form-description'>What type of food does your business serve</p>
      <label >
        Category :
        <select
          className="business-form-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value='' disabled selected hidden>Please select a category</option>
          <option value='Asian Fusion'>Asian Fusion</option>
          <option value='Bar'>Bar</option>
          <option value='Brunch'>Brunch</option>
          <option value='Cafe'>Cafe</option>
          <option value='Casual'>Casual</option>
          <option value='Cocktail Bar'>Cocktail Bar</option>
          <option value='Deli'>Deli</option>
          <option value='Dessert'>Dessert</option>
          <option value='Dinner'>Dinner</option>
          <option value='Fast Food'>Fast Food</option>
          <option value='Fine Dining'>Fine Dining</option>
          <option value='German'>German</option>
          <option value='Indian'>Indian</option>
          <option value='Italian'>Italian</option>
          <option value='Japanese'>Japanese</option>
          <option value='Mexican'>Mexican</option>
          <option value='Palestinian'>Palestinian</option>
          <option value='Pub'>Pub</option>
          <option value='Seafood'>Seafood</option>
          <option value='Tapas'>Tapas</option>
        </select>
      </label>
      {validations.category && (<p className='validation-err-text'>{validations.category}</p>)}

      <label>
        Description :
        <textarea
          className='create-description-textarea'
          type='text'
          name='description'
          value={description}
          placeholder='Description'
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </label>
      {validations.description && (<p className='validation-err-text'>{validations.description}</p>)}
      <label>
        <input
          type='file'
          className="business-form-file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        ></input>
      </label>
      {(imageLoading) && <p>Loading...</p>}
      {validations.image && (<p className='validation-err-text'>{validations.image}</p>)}
      {image?.length > 0 && (
        <label htmlFor="post-image-input" className="file-input-labels-noname"><img src={image} className="thumbnails-noname"></img></label>
      )}
      {/* <hr className='create-form-line'></hr>
      <h3 className="create-form-h3">Add your images</h3>
      <label>
        Submit an Image :
        <input
          type='file'
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          placeholder='Add an Image'
        ></input>
      </label> */}
      {/* <h2>Schedule</h2>
      <label>
        Monday : <br></br>
        <input
          list='hours'
          name='mondayOpen'
          value={mondayopen}
          placeholder='Open'
          onChange={(e) => setMondayOpen(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
      <label>
        <input
            list='hours'
            name='mondayClose'
            value={mondayclose}
            placeholder='Close'
            onChange={(e) => setMondayClose(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
<br></br>
      <label>
        Tuesday : <br></br>
        <input
          list='hours'
          name='tuesdayOpen'
          value={tuesdayopen}
          placeholder='Open'
          onChange={(e) => setTuesdayOpen(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
      <label>
        <input
            list='hours'
            name='tuesdayClose'
            value={tuesdayclose}
            placeholder='Close'
            onChange={(e) => setTuesdayClose(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
<br></br>
      <label>
        Wednesday : <br></br>
        <input
          list='hours'
          name='wednesdayopen'
          value={wednesdayopen}
          placeholder='Open'
          onChange={(e) => setWednesdayOpen(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
      <label>
        <input
            list='hours'
            name='wednesdayclose'
            value={wednesdayclose}
            placeholder='Close'
            onChange={(e) => setWednesdayClose(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
<br></br>
      <label>
        Thursday : <br></br>
        <input
          list='hours'
          name='thursdayopen'
          value={thursdayopen}
          placeholder='Open'
          onChange={(e) => setThursdayOpen(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
      <label>
        <input
            list='hours'
            name='thursdayclose'
            value={thursdayclose}
            placeholder='Close'
            onChange={(e) => setThursdayClose(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
<br></br>
      <label>
        Friday : <br></br>
        <input
          list='hours'
          name='fridayopen'
          value={fridayopen}
          placeholder='Open'
          onChange={(e) => setFridayOpen(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
      <label>
        <input
            list='hours'
            name='fridayclose'
            value={fridayclose}
            placeholder='Close'
            onChange={(e) => setFridayClose(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
<br></br>
      <label>
        Saturday : <br></br>
        <input
          list='hours'
          name='saturdayopen'
          value={saturdayopen}
          placeholder='Open'
          onChange={(e) => setSaturdayOpen(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
      <label>
        <input
            list='hours'
            name='saturdayclose'
            value={saturdayclose}
            placeholder='Close'
            onChange={(e) => setSaturdayClose(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
<br></br>
      <label>
        Sunday : <br></br>
        <input
          list='hours'
          name='sundayopen'
          value={sundayopen}
          placeholder='Open'
          onChange={(e) => setSundayOpen(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label>
      <label>
        <input
            list='hours'
            name='sundayclose'
            value={sundayclose}
            placeholder='Close'
            onChange={(e) => setSundayClose(e.target.value)}
        ></input>
        <datalist id='hours'>
          <option value='None'></option>
          <option value='12:00am'></option>
          <option value='1:00am'></option>
          <option value='2:00am'></option>
          <option value='3:00am'></option>
          <option value='4:00am'></option>
          <option value='5:00am'></option>
          <option value='6:00am'></option>
          <option value='7:00am'></option>
          <option value='8:00am'></option>
          <option value='9:00am'></option>
          <option value='10:00am'></option>
          <option value='11:00am'></option>
          <option value='12:00pm'></option>
          <option value='1:00pm'></option>
          <option value='2:00pm'></option>
          <option value='3:00pm'></option>
          <option value='4:00pm'></option>
          <option value='5:00pm'></option>
          <option value='6:00pm'></option>
          <option value='7:00pm'></option>
          <option value='8:00pm'></option>
          <option value='9:00pm'></option>
          <option value='10:00pm'></option>
          <option value='11:00pm'></option>
        </datalist>
      </label> */}
      <div className="bzns-submit-container">
      <button className="bzns-submit-btn" id='submit-button' type='submit' disabled={isValidated}>{buttonName}</button>
      {(imageLoading) && <p>Loading...</p>}
      </div>
    </form>
  )
}

export default CreateNewBusiness
