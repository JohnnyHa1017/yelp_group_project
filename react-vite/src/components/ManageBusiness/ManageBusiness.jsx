import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getBusinessImagesThunk, landingPageThunk } from '../../redux/business'
import { NavLink } from 'react-router-dom';
import { getAllMenusThunk } from '../../redux/menu';
import DeleteBusiness from '../DeleteBusiness/DeleteBusiness';
import './ManageBusiness.css'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import Loading from '../Loading/Loading';

function ManageBusiness() {
    const dispatch = useDispatch()
    const currUser = useSelector(state => state.session.user)
    const business = useSelector(state => state.business.Business)
    const busImgs = useSelector(state => state.business.Business_Images)
    const amenities = useSelector(state => state.business.Amenities)
    const menus = useSelector(state => state.menus)

    const [deleteBus, setDeleteBus] = useState(false)
    const reRenderOnDelete = () => {
        setDeleteBus(!deleteBus)
    }

    useEffect(() => {
        dispatch(landingPageThunk())
        dispatch(getAllMenusThunk())
        dispatch(getBusinessImagesThunk())
    }, [dispatch, deleteBus])

    if (!currUser || !business || !amenities || !menus || !busImgs) {
        return <div><Loading /></div>
    }

    const currBusiness = []
    for (let bus of business) { //adding business into the currBus arr
        if (bus?.owner_id == currUser?.id) {
            currBusiness.push(bus)
        }
    }

    // function getImgs(businessId) {
    //     let imgs = busImgs.filter(img => img.business_id == businessId);
    //     const length = imgs.length
    //     if (length) {
    //         return imgs[Math.floor(Math.random() * length)].url
    //     }
    //     return null
    // }


    let amenityArr = []
    if (currBusiness && business) {
        for (let amenity of amenities) {
            for (let eachBusiness of currBusiness) {
                if (amenity.business_id == eachBusiness.id) {
                    amenityArr.push(amenity)
                }
            }
        }
    }

    function checkAmenity(businessId) {
        for (let a of amenityArr) {
            if (a.business_id == businessId) {
                return true
            }
        }
        return false
    }
    const menuArr = Object.keys(menus).map(key => ({
        id: key,
        ...menus[key]
    }))

    function checkMenu(businessId) {
        for (let m of menuArr) {
            if (m.business_id == businessId) {
                return true
            }
        }
        return false
    }
    return (
        <>
            <h1>Hello {currUser.first_name}</h1>
            <h2 className='your-business-text'>Your Businesses</h2>
            <div className='manage-businesses-container'>
                {!currBusiness && (
                    <>
                        <p>You have no businesses</p>
                        <button><NavLink>Create a business!</NavLink></button>
                    </>
                )}
                {currBusiness.length > 0 && (
                    <p className='manage-bus-description'>{`You have ${currBusiness.length} businesses on Munch`}</p>
                )}
                {currBusiness.map(bus => (
                    <div key={bus.id} className='manage-onebusiness-container'>
                        <NavLink className='manage-nav-container' key={bus?.id} to={`/business/${bus?.id}`}>
                            <div className='nav-bus-container'>
                                <div className='manage-address-container'>
                                    <p className='manage-bus-title'>{bus?.title}</p>
                                    <p className='manage-bus-address'>{bus?.address}</p>
                                    <p className='manage-bus-city'>{bus?.city}, {bus?.state}</p>
                                    {checkMenu(bus.id) && (
                                        <NavLink className='manage-see-menu' to={`/business/${bus.id}/menus`}>See Menu</NavLink>
                                    )}
                                </div>
                                {bus.businessImages[0]?.url && (
                                    <img className='manage-bus-img ' src={bus.businessImages[0]?.url} alt={`Image for ${bus.title}`} />
                                )}
                            </div>
                        </NavLink>
                        <NavLink to={`/business/${bus?.id}/edit`} className='manage-btns'>
                            <button className='manage-btn-text'>Update Business</button>
                        </NavLink>

                        <NavLink to={`/business/${bus.id}/delete`} className='manage-btns manage-delete'>
                            <button className='manage-btn-text'>Delete Business</button>
                        </NavLink>

                        <NavLink to={`/business/${bus.id}/menus/new`} className='manage-btns'>
                            <button className='manage-btn-text'>Add Menu Item</button>
                        </NavLink>

                        {!checkAmenity(bus.id) && (
                            <NavLink to={`/business/${bus.id}/amenities`} className='manage-btns'>
                                <button className='manage-btn-text'>Add Amenities</button>
                            </NavLink>
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default ManageBusiness;
