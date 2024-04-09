import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { businessAmenitiesThunk, specificBusinessThunk } from '../../redux/business'
import { menuByBusinessThunk } from '../../redux/menu'
import { NavLink, useParams } from 'react-router-dom'
import { businessReviewThunk } from "../../redux/reviews";
import './BusinessDetails.css'
import BusinessReviews from "../BusinessReviews/BusinessReviews";
import MenusByBusinessId from "../Menu/MenusByBusiness";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteBusiness from "../DeleteBusiness/DeleteBusiness";

import default_business_background from '../../images/default_business_background.jpg'
import { PiBowlFoodFill } from "react-icons/pi";
import { LuBean } from "react-icons/lu";
import { MdOutlineRateReview } from "react-icons/md";
import { BiGame, BiSolidGame, BiSolidBadgeDollar } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { IoCheckmarkCircle, IoCheckmarkCircleOutline, IoEarth } from "react-icons/io5";
import { FaPhoneVolume, FaRegKeyboard } from "react-icons/fa";



export default function OneBusiness() {
  const dispatch = useDispatch()
  const business = useSelector(state => state.business)
  const reviews = useSelector(state => state.reviews)
  const menus = useSelector(state => state.menus)
  const currUser = useSelector(state => state.session)
  const { businessId } = useParams()

  const [deleteBus, setDeleteBus] = useState(false)
  const reRenderOnDelete = () => {
    setDeleteBus(!deleteBus)
  }

  //get average start rating
  let avgStarRating = 0
  let priceRating = 1
  let hasWrittenReview = false
  let hasUserLoggedIn = false
  let isOwner = false
  let businessPreviewImg = {}
  let businessPreviewImgUrl = ''
  let businessCategory = ""
  let businessSchedule = ""
  let selectedBusiness = {}

  if (business && businessId) {
    //get selected business
    const id = businessId
    selectedBusiness = business[id]
    //select menu images
    if (selectedBusiness) {
      priceRating = selectedBusiness.price_rating
      //get category
      let businessCategoryStr = selectedBusiness.category
      if (businessCategoryStr.includes('"')) {
        let categories = businessCategoryStr.split(',').filter(category => category.includes('"')).map(category => category.split('"')[1]);
        businessCategory = categories.join(" & ");
      } else {
        businessCategory = businessCategoryStr;
      }
      //get schedule
      businessSchedule = selectedBusiness.schedule
    }
  }

  if (reviews.Review) {
    //get average rating
    avgStarRating = reviews.Review.reduce((acc, curr) => {
      if ('star' in curr && typeof curr.star == 'number') {
        return acc + curr.star
      } else {
        return acc
      }
    }, 0) / reviews.Review.length
    avgStarRating = avgStarRating.toFixed(1)
  }

  //check user review
  if (reviews.Review && currUser.user) {
    for (let eachReview of reviews.Review) {
      if (eachReview.user_id == currUser.user.id) {
        hasWrittenReview = true
      }
    }
  }
  //check user
  if (!currUser.user) {
    hasWrittenReview = true
  } else {
    hasUserLoggedIn = true
  }
  if (currUser.user && selectedBusiness) {
    if (currUser.user.id == selectedBusiness.owner_id) {
      isOwner = true
    }
  }

  let amenities = {}
  let isAccepts_cc = false
  let isDelivery = false
  let isFreeWF = false
  let isGoodGroup = false
  let isOutdoor = false
  let isPickup = false
  let isReservation = false
  let isSP = false
  let isVegetarian = false

  if (business.Amenities) {
    //get amenity object
    const allAmenities = business.Amenities
    for (let eachAm of allAmenities) {
      if (eachAm.business_id == businessId) {
        amenities = eachAm
      }
    }
    for (const key in amenities) {
        switch (key) {
          case 'accepts_credit_card': //to get each key
            isAccepts_cc = amenities[key] //assign boolean values
            break
          case 'delivery':
            isDelivery = amenities[key]
            break
          case 'free_wi_fi':
            isFreeWF = amenities[key]
            break
          case 'good_for_groups':
            isGoodGroup = amenities[key]
            break
          case 'outdoor_seating':
            isOutdoor = amenities[key]
            break
          case 'pickup':
            isPickup = amenities[key]
            break
          case 'reservation':
            isReservation = amenities[key]
            break
          case 'street_parking':
            isSP = amenities[key]
            break
          case 'vegetarian':
            isVegetarian = amenities[key]
            break
          default:
            break
        }
    }
  }

  //business background image
  if (selectedBusiness?.businessImages) {
    businessPreviewImg = selectedBusiness.businessImages[0].url
    console.log('businessPreviewImg ==>', businessPreviewImg)
  } else {
    businessPreviewImgUrl = default_business_background
  }

  const throwAlter = () => {
    alert('Feature coming soon')
  }

  useEffect(() => {
    dispatch(specificBusinessThunk(businessId))
  }, [businessId, dispatch, Object.keys(menus).length])


  return (
    <>
      {business ? (
        <div className="business-detail-page-container">
          <div className="business-detail-header-container">
            <div className="business-detail-header-img" style={{ backgroundImage: `url(${businessPreviewImg})`, height: '360px' }}>
              <h1 className="business-detail-header-text">{selectedBusiness?.title}</h1>
              <div className="bd-star-rating-container">
                {reviews.Review && avgStarRating > 0 ? (
                  <>
                    {[...Array(Math.floor(avgStarRating))].map((_, index) => (
                      <BiSolidGame key={index} className="bd-star" />
                    ))}
                    {avgStarRating % 1 !== 0 && <BiGame className="bd-star" />}
                    {[...Array(5 - Math.ceil(avgStarRating))].map((_, index) => (
                      <LuBean key={index} className="bd-star" />
                    ))}
                    <h3 className="business-detail-header-text">
                      {avgStarRating} ({reviews.Review.length} reviews)
                    </h3>
                  </>) : (
                  <>
                    <BiGame className="bd-star" />
                    <BiGame className="bd-star" />
                    <BiGame className="bd-star" />
                    <BiGame className="bd-star" />
                    <BiGame className="bd-star" />
                    <h3>no review</h3>
                  </>
                )}
              </div>
              <p className="business-detail-header-text">
                {businessCategory}
              </p>
              <div>
                {[...Array(priceRating)].map((_, index) => (
                  <BiSolidBadgeDollar key={index} className="bd-dollar-sign" />
                ))}
              </div>
              <p className="business-detail-header-text schedule-text">
                {businessSchedule}
              </p>
            </div>
          </div>
          {hasUserLoggedIn &&
            <div className="business-detail-action-buttons-container">
              <button className="bd-red-action-buttons">
                <NavLink className='red-button-text' to={`/business/${businessId}/menus`}>
                  <PiBowlFoodFill />View Full Menu
                </NavLink>
              </button>
              {!hasWrittenReview &&
                <button className="bd-red-action-buttons">
                  <NavLink className='red-button-text' to={`/business/${businessId}/review/new`}>
                    <FaRegKeyboard />Write a review
                  </NavLink>
                </button>
              }
              <button className="bd-red-action-buttons">
                <NavLink className='red-button-text' to={`/business/${businessId}/reviews`}>
                  <MdOutlineRateReview />View All Reviews
                </NavLink>
              </button>
              <button className="bd-blue-action-buttons" onClick={throwAlter}>Follow</button>
              <button className="bd-blue-action-buttons" onClick={throwAlter}>Share</button>
              <button className="bd-blue-action-buttons" onClick={throwAlter}>Save</button>
            </div>
          }
          <div className="business-detail-context-container">
            <div className="business-contexts">
                <div className="menu-container">
                  <MenusByBusinessId />
                </div>
              <div className="business-info-container">
                {businessSchedule &&
                  <>
                    <h2>Schedule</h2>
                    {businessSchedule}
                  </>}
                <h2>Amenities</h2>
                <div className="business-detail-amenity-container">
                  <div className="amenity-blocks">
                    <p>Accepts Credit Card</p>
                    {isAccepts_cc ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                  <div className="amenity-blocks">
                    <p>Delivery</p>
                    {isDelivery ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                  <div className="amenity-blocks">
                    <p>Pickup</p>
                    {isPickup ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                  <div className="amenity-blocks">
                    <p>Reservation</p>
                    {isReservation ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                  <div className="amenity-blocks">
                    <p>Street Parking</p>
                    {isSP ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                  <div className="amenity-blocks">
                    <p>Free Wi-Fi</p>
                    {isFreeWF ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                  <div className="amenity-blocks">
                    <p>Good for Groups</p>
                    {isGoodGroup ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                  <div className="amenity-blocks">
                    <p>Out Door Seating</p>
                    {isOutdoor ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                  <div className="amenity-blocks">
                    <p>Vegetarian</p>
                    {isVegetarian ? (<IoCheckmarkCircle className="amenity-tags" />) : (<IoCheckmarkCircleOutline className="amenity-tags" />)}
                  </div>
                </div>
              </div>
              <div className="reviews-container">
                <h1>Reviews for {selectedBusiness?.title}</h1>
                <BusinessReviews />
              </div>
            </div>

            <div className="business-dtl-info-container">
              <div className="business-dtl-info-box">
                <h2>Order Online</h2>
                <button className="bd-red-action-buttons" onClick={throwAlter}>ORDER NOW</button>
              </div>
              <div className="business-dtl-info-box">
                <div className="business-dtl-info">
                  <p className="business-dtl-info-box-text">
                    {selectedBusiness?.phone_number}
                  </p>
                  <FaPhoneVolume className="business-dtl-info-logo" />
                </div>
                <div className="business-dtl-info">
                  <p className="business-dtl-info-box-text">
                    {selectedBusiness?.address}, {selectedBusiness?.city}, {selectedBusiness?.state}
                  </p>
                  <HiLocationMarker className="business-dtl-info-logo" />
                </div>
                <div className="business-dtl-info">
                  <p className="business-dtl-info-box-text">
                    {selectedBusiness?.country}
                  </p>
                  <IoEarth className="business-dtl-info-logo" />
                </div>
                <button className="bd-red-action-buttons" onClick={throwAlter}>Suggest an edit</button>
              </div>
              {isOwner &&
                <div className="business-dtl-info-box">
                  <h2>Owner&apos;s Hub</h2>
                  <button className="bd-red-action-buttons">
                    <NavLink className='red-button-text' to={`/business/${businessId}/menus/new`}>
                      Add Menu Item
                    </NavLink>
                  </button>
                  {/* <button className="bd-red-action-buttons">
                    <NavLink className='red-button-text' to={`/business/${businessId}/amenities`}>
                      Add Amenity
                    </NavLink>
                  </button> */}
                  <button className="bd-red-action-buttons">
                    <NavLink className='red-button-text' to={`/business/${businessId}/edit`}>
                      Edit My Business
                    </NavLink>
                  </button>
                  <button className="bd-red-action-buttons">
                    <OpenModalMenuItem className='red-button-text'
                      itemText='Delete Business'
                      modalComponent={<DeleteBusiness businessId={businessId} reRenderOnDelete={reRenderOnDelete} />}
                    />
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      ) : (
        <h2>Loading ...</h2>
      )}
    </>
  )
}
