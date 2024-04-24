import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { menuByBusinessThunk } from '../../redux/menu'
import { specificBusinessThunk } from '../../redux/business'
import Loading from '../Loading/Loading'

function MenusByBusinessId({isFullPage}) {
    const dispatch = useDispatch()
    const { businessId } = useParams()
    // const stateMenus = useSelector((state) => state.menus.Menu)
    const menuImages = useSelector((state) => state.menus.Business_Images)
    const business = useSelector((state) => state.business[businessId])


    let menus = []
    let menu_images = []
    let appetizers = []
    let drinks = []
    let entrees = []
    let desserts = []
    let specials = []
    let currMenu = business.menu

    if (menuImages && currMenu) {
        menus = currMenu.filter(ele => ele.business_id == businessId)
        for (let img of menuImages) {
            if (img.business_id == businessId && img.menu_id) {
                menu_images.push(img)
            }
        }
        if (menus.length > 0) {
            appetizers = menus.filter(e => e.category == 'Appetizer')
            drinks = menus.filter(e => e.category == 'Drink')
            entrees = menus.filter(e => e.category == 'Entree')
            desserts = menus.filter(e => e.category == 'Dessert')
            specials = menus.filter(e => e.category == 'Specials')
        }
    }

    useEffect(() => {
        dispatch(menuByBusinessThunk(businessId))
        dispatch(specificBusinessThunk(businessId)) //TO GET BUSINESS TITLE TO SHOW ON PAGE
    }, [dispatch, businessId])


    return (
        <section>
            {business ? (
                <div className={`menu-page-container ${isFullPage ? 'full' : ''}`}>
                    <h1 className='menu-detail-text-black'>{business?.title}&apos;s Menu</h1>
                    {appetizers.length > 0 && <div className='menu-type-container'>
                        <h2>Appetizer</h2>
                        <hr></hr>
                        <div className='menu-page-all-items-container'>
                            {appetizers.map((menu, index) => {
                                const matchedImage = menu_images?.find(image => image.menu_id === menu.id);
                                return (
                                    <div className='menu-item-container' key={index}>
                                        <h3>{menu?.name}</h3>
                                        <p>{menu?.description}</p>
                                        <p className='menu-detail-text'>{menu?.price} $</p>
                                        {matchedImage &&
                                            <img className='menu-item-img' src={matchedImage?.url} alt={`Image for ${menu.menu_name}`} />
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    {drinks.length > 0 &&  <div className='menu-type-container'>
                        <h2>Drinks</h2>
                        <hr></hr>
                        <div className='menu-page-all-items-container'>
                            {drinks.map((menu, index) => {
                                const matchedImage = menu_images?.find(image => image.menu_id === menu.id);
                                return (
                                    <div className='menu-item-container' key={index}>
                                        <h2>{menu?.name}</h2>
                                        <p>{menu?.description}</p>
                                        <p className='menu-detail-text'>{menu?.price} $</p>
                                        {matchedImage &&
                                            <img className='menu-item-img' src={matchedImage?.url} alt={`Image for ${menu.menu_name}`} />
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    {entrees.length > 0 && <div className='menu-type-container'>
                        <h2>Entree</h2>
                        <hr></hr>
                        <div className='menu-page-all-items-container'>
                            {entrees.map((menu, index) => {
                                const matchedImage = menu_images?.find(image => image.menu_id === menu.id);
                                return (
                                    <div className='menu-item-container' key={index}>
                                        <h2>{menu?.name}</h2>
                                        <p>{menu?.description}</p>
                                        <p className='menu-detail-text'>{menu?.price} $</p>
                                        {matchedImage &&
                                            <img className='menu-item-img' src={matchedImage?.url} alt={`Image for ${menu.menu_name}`} />
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    {desserts.length > 0 && <div className='menu-type-container'>
                        <h2>Dessert</h2>
                        <hr></hr>
                        <div className='menu-page-all-items-container'>
                            {desserts.map((menu, index) => {
                                const matchedImage = menu_images?.find(image => image.menu_id === menu.id);
                                return (
                                    <div className='menu-item-container' key={index}>
                                        <h2>{menu?.name}</h2>
                                        <p>{menu?.description}</p>
                                        <p className='menu-detail-text'>{menu?.price} $</p>
                                        {matchedImage &&
                                            <img className='menu-item-img' src={matchedImage?.url} alt={`Image for ${menu.menu_name}`} />
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    {specials.length > 0 && <div className='menu-type-container'>
                        <h2>Specials</h2>
                        <hr></hr>
                        <div className='menu-page-all-items-container'>
                            {specials.map((menu, index) => {
                                const matchedImage = menu_images?.find(image => image.menu_id === menu.id);
                                return (
                                    <div className='menu-item-container' key={index}>
                                        <h2>{menu?.name}</h2>
                                        <p>{menu?.description}</p>
                                        <p className='menu-detail-text'>{menu?.price} $</p>
                                        {matchedImage &&
                                            <img className='menu-item-img' src={matchedImage?.url} alt={`Image for ${menu.menu_name}`} />
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>}
                    {isFullPage &&
                        <div className='menu-page-button-container'>
                            <button className="bd-blue-action-buttons">
                                <NavLink className='red-button-text' to={`/business/${businessId}`}>
                                    Back
                                </NavLink>
                            </button>
                        </div>}
                </div>
            ) : (
                <Loading />
            )}
        </section>
    )
}

export default MenusByBusinessId
