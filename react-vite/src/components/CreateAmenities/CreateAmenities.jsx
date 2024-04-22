import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createNewAmenitiesThunk, specificBusinessThunk, businessAmenitiesThunk } from '../../redux/business'
import './CreateAmenities.css'
import { BsCalendar2CheckFill } from "react-icons/bs";
import { TbTruckDelivery } from "react-icons/tb";
import { MdOutlineTakeoutDining } from "react-icons/md";
import { RiLeafFill } from "react-icons/ri";
import { FaRegCreditCard } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { LuParkingSquare } from "react-icons/lu";
import { MdOutlineGroups } from "react-icons/md";
import { MdOutlineDeck } from "react-icons/md";

function CreateAmenity() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const { businessId } = useParams()
    const business = useSelector(state => state.business)
    console.log(business)

    useEffect(() => {
        dispatch(specificBusinessThunk(businessId))
        dispatch(businessAmenitiesThunk(businessId))
    }, [dispatch, businessId])

    const [reservation, setReservation] = useState(false)
    const [delivery, setDelivery] = useState(false)
    const [pickup, setPickup] = useState(false)
    const [vegetarian, setVegetarian] = useState(false)
    const [accepts_credit_card, setAcceptsCreditCard] = useState(false)
    const [free_wi_fi, setFreeWifi] = useState(false)
    const [street_parking, setStreetParking] = useState(false)
    const [good_for_groups, setGoodForGroups] = useState(false)
    const [outdoor_seating, setOutdoorSeating] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    console.log(submitted)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitted(true)
        const newAmenity = {
            reservation,
            delivery,
            pickup,
            vegetarian,
            accepts_credit_card,
            free_wi_fi,
            street_parking,
            good_for_groups,
            outdoor_seating
        }
        await dispatch(createNewAmenitiesThunk(businessId, newAmenity))
        nav(`/business/${businessId}`)
    }

    return (
        <>
            <h1 className='CR-bzns-title'>Add your Amenities</h1>
            <div className='create-amen-form-container'>
                <h3 className='create-amen-description'>Business Amenities</h3>
                <p className='create-form-description'>Select all that apply to your business</p>
                <form className='create-amen-form' onSubmit={handleSubmit}>
                    <label className={`amenities-label-container ${reservation ? 'checked' : ''}`}>
                        <BsCalendar2CheckFill className='amen-icons' />
                        Reservation
                        <input
                            type='checkbox'
                            name='reservation'
                            checked={reservation}
                            onChange={(e) => setReservation(e.target.checked)}
                        ></input>
                    </label>
                    <label className={`amenities-label-container ${delivery ? 'checked' : ''}`}>
                        <TbTruckDelivery className='amen-icons' />
                        Delivery
                        <input
                            type='checkbox'
                            name='delivery'
                            checked={delivery}
                            onChange={(e) => setDelivery(e.target.checked)}
                        ></input>
                    </label>
                    <label className={`amenities-label-container ${pickup ? 'checked' : ''}`}>
                        <MdOutlineTakeoutDining className='amen-icons' />
                        Pick up
                        <input
                            type='checkbox'
                            name='pick up'
                            checked={pickup}
                            onChange={(e) => setPickup(e.target.checked)}
                        ></input>
                    </label>
                    <label className={`amenities-label-container ${vegetarian ? 'checked' : ''}`}>
                        <RiLeafFill className='amen-icons' />
                        Vegetarian
                        <input
                            type='checkbox'
                            name='vegetarian'
                            checked={vegetarian}
                            onChange={(e) => setVegetarian(e.target.checked)}
                        ></input>
                    </label>
                    <label className={`amenities-label-container ${accepts_credit_card ? 'checked' : ''}`}>
                        <FaRegCreditCard className='amen-icons' />
                        Accepts credit card
                        <input
                            type='checkbox'
                            name='accepts credit card'
                            checked={accepts_credit_card}
                            onChange={(e) => setAcceptsCreditCard(e.target.checked)}
                        ></input>
                    </label>
                    <label className={`amenities-label-container ${free_wi_fi ? 'checked' : ''}`}>
                        <FaWifi className='amen-icons' />
                        Free Wifi
                        <input
                            type='checkbox'
                            name='free wifi'
                            checked={free_wi_fi}
                            onChange={(e) => setFreeWifi(e.target.checked)}
                        ></input>
                    </label>
                    <label className={`amenities-label-container ${street_parking ? 'checked' : ''}`}>
                        <LuParkingSquare className='amen-icons' />
                        Street Parking
                        <input
                            type='checkbox'
                            name='street parking'
                            checked={street_parking}
                            onChange={(e) => setStreetParking(e.target.checked)}
                        ></input>
                    </label>
                    <label className={`amenities-label-container ${good_for_groups ? 'checked' : ''}`}>
                        <MdOutlineGroups className='amen-icons' />
                        Good for groups
                        <input
                            type='checkbox'
                            name='good for groups'
                            checked={good_for_groups}
                            onChange={(e) => setGoodForGroups(e.target.checked)}
                        ></input>
                    </label>
                    <label className={`amenities-label-container ${outdoor_seating ? 'checked' : ''}`}>
                        <MdOutlineDeck className='amen-icons' />
                        Outdoor seating
                        <input
                            type='checkbox'
                            name='outdoor seating'
                            checked={outdoor_seating}
                            onChange={(e) => setOutdoorSeating(e.target.checked)}
                        ></input>
                    </label>
                    <button className='bzns-submit-btn' type='submit'>Add Amenities</button>
                </form>
            </div>
        </>
    )
}

export default CreateAmenity;
