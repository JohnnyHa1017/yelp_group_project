import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { landingPageThunk } from "../../redux/business";
import { BiSolidBadgeDollar } from "react-icons/bi";
// import Loading from "../Loading/Loading";
import './Category.css'

export default function Category() {
  const dispatch = useDispatch()
  const { category } = useParams()
  
  const reviewsArray = useSelector(state => state.business.Review)
  const businesses = useSelector(state => state.business?.Business)
  const amenities = useSelector(state => state.business?.Amenities)
  let selectedBusiness = businesses?.filter(ele => ele.category.includes(category))
  selectedBusiness?.forEach(bus => bus.amenities = amenities?.filter(ele => ele.business_id == bus.id)[0])

  // Amenity filter
  const [CreditCard, setCreditCard] = useState(false)
  const [Pickup, setPickup] = useState(false)
  const [Delivery, setDelivery] = useState(false)
  const [Reservation, setReservation] = useState(false)
  const [StreetParking, setParking] = useState(false)
  const [Groups, setGroups] = useState(false)
  const [OutdoorSeating, setSeating] = useState(false)
  const [Vegetarian, setVegetarian] = useState(false)
  if (CreditCard) {
    selectedBusiness = selectedBusiness.filter(bus => bus.amenities.accepts_credit_card == true)
  }
  if (Pickup) {
    selectedBusiness = selectedBusiness.filter(bus => bus.amenities.pickup == true)
  }
  if (Delivery) {
    selectedBusiness = selectedBusiness.filter(bus => bus.amenities.delivery == true)
  }
  if (Reservation) {
    selectedBusiness = selectedBusiness.filter(bus => bus.amenities.reservation == true)
  }
  if (Groups) {
    selectedBusiness = selectedBusiness.filter(bus => bus.amenities.good_for_groups == true)
  }
  if (OutdoorSeating) {
    selectedBusiness = selectedBusiness.filter(bus => bus.amenities.outdoor_seating == true)
  }
  if (Vegetarian) {
    selectedBusiness = selectedBusiness.filter(bus => bus.amenities.vegetarian == true)
  }

  // Category filter
  const [cafe, setCafe] = useState(false)
  const [japanese, setJapanese] = useState(false)
  const [italian, setItalian] = useState(false)
  const [bar, setBar] = useState(false)
  const [seafood, setSeafood] = useState(false)
  const [german, setGerman] = useState(false)
  const [asianFusion, setAsianFusion] = useState(false)
  const [brunch, setBrunch] = useState(false)
  const [deli, setDeli] = useState(false)
  const handleCategory = (category, categorySetter) => {
    categorySetter(!category)
  }
  if (cafe) {
    selectedBusiness = selectedBusiness.filter(bus => bus.category.includes('Cafe'))
  }
  if (japanese) {
    selectedBusiness = selectedBusiness.filter(bus => bus.category.includes('Japanese'))
  }
  if (italian) {
    selectedBusiness = selectedBusiness.filter(bus => bus.category.includes('Italian'))
  }
  if (bar) {
    selectedBusiness = selectedBusiness.filter(bus => bus.category.includes('Bar'))
  }
  if (seafood) {
    selectedBusiness = selectedBusiness.filter(bus => bus.category.includes('Seafood'))
  }
  if (asianFusion) {
    selectedBusiness = selectedBusiness.filter(bus => bus.category.includes('Asian Fusion'))
  }
  if (brunch) {
    selectedBusiness = selectedBusiness.filter(bus => bus.category.includes('Brunch'))
  }
  if (deli) {
    selectedBusiness = selectedBusiness.filter(bus => bus.category.includes('Deli'))
  }

  // price filter
  const [priceRating, setPriceRating] = useState(0)
  const handlePriceFilter = (price) => {
    setPriceRating(price)
  }
  if (priceRating !== 0) {
    selectedBusiness = selectedBusiness.filter(bus => bus.price_rating == priceRating)
  }

  function renderPriceRating(priceRating) {
    switch (priceRating) {
      case 1:
        return <BiSolidBadgeDollar />;
      case 2:
        return (
          <>
            <BiSolidBadgeDollar />
            <BiSolidBadgeDollar />
          </>
        );
      case 3:
        return (
          <>
            <BiSolidBadgeDollar />
            <BiSolidBadgeDollar />
            <BiSolidBadgeDollar />
          </>
        );
      case 4:
        return (
          <>
            <BiSolidBadgeDollar />
            <BiSolidBadgeDollar />
            <BiSolidBadgeDollar />
            <BiSolidBadgeDollar />
          </>
        );
      default:
        return null;
    }
  }

  useEffect(() => {
    dispatch(landingPageThunk())
  }, [dispatch])

  function businessAvgRating(businessId) {
    let avgRating = 0
    let numRev = 0
    for (let review of reviewsArray) {
        if (review.business_id == businessId) {
            numRev++
            avgRating += review.star
        }
    }
    return avgRating / numRev
  }
  //render stars
  function renderStars(starValue) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= starValue) {
            stars.push(<span key={i} className="l-star-filled l-star-icon">★</span>);
        } else {
            stars.push(<span key={i} className="l-star-empty l-star-icon">☆</span>);
        }
    }
    return stars
  }

  return (
    <>
      <h1>{category}</h1>
      <div className='cat-business-container'>
      <div className='category-filter'>
        <p className='filter-headers'>Filters</p>
        <p className='filter-headers'>Price</p>
          <div>
            <button className={`price-btns ${priceRating == 1 ? 'on' : 'off'}`} onClick={() => handlePriceFilter(1)}>$</button>
            <button className={`price-btns ${priceRating == 2 ? 'on' : 'off'}`} onClick={() => handlePriceFilter(2)}>$$</button>
            <button className={`price-btns ${priceRating == 3 ? 'on' : 'off'}`} onClick={() => handlePriceFilter(3)}>$$$</button>
            <button className={`price-btns ${priceRating == 4 ? 'on' : 'off'}`} onClick={() => handlePriceFilter(4)}>$$$$</button>
            <button className={`price-btns ${priceRating == 0 ? 'on' : 'off'}`} onClick={() => handlePriceFilter(0)}>All</button>
          </div>
        <hr></hr>
        <p className='filter-headers'>Features</p>
          <div className='features-container'>
            <div>
              <input type="checkbox" name="features" placeholder=" " value="CreditCard" onClick={() => setCreditCard(!CreditCard)}></input>
              <label>Accepts Credit Cards</label>
            </div>
            <div>
              <input type="checkbox" name="features" placeholder=" " value="Pickup" onClick={() => setPickup(!Pickup)}></input>
              <label>Offers Pickup</label>
            </div>
            <div>
              <input type="checkbox" name="features" placeholder=" " value="Delivery" onClick={() => setDelivery(!Delivery)}></input>
              <label>Offers Delivery</label>
            </div>
            <div>
              <input type="checkbox" name="features" placeholder=" " value="Reservation" onClick={() => setReservation(!Reservation)}></input>
              <label>Accepts Reservations</label>
            </div>
            <div>
              <input type="checkbox" name="features" placeholder=" " value="StreetParking" onClick={() => setParking(!StreetParking)}></input>
              <label>Has Street Parking</label>
            </div>
            <div>
              <input type="checkbox" name="features" placeholder=" " value="Groups" onClick={() => setGroups(!Groups)}></input>
              <label>Good for Groups</label>
            </div>
            <div>
              <input type="checkbox" name="features" placeholder=" " value="OutdoorSeating" onClick={() => setSeating(!OutdoorSeating)}></input>
              <label>Has Outdoor Seating</label>
            </div>
            <div>
              <input type="checkbox" name="features" placeholder=" " value="Vegetarian" onClick={() => setVegetarian(!Vegetarian)}></input>
              <label>Has Vegetarian Options</label>
            </div>
          </div>
          <hr></hr>
          <p className='filter-headers'>Categories</p>
          <div className='filter-categories'>
            <button onClick={() => handleCategory(cafe, setCafe)} className={`cat-btns ${cafe ? 'on' : 'off'}`}>Cafe</button>
            <button onClick={() => handleCategory(japanese, setJapanese)} className={`cat-btns ${japanese ? 'on' : 'off'}`}>Japanese</button>
            <button onClick={() => handleCategory(italian, setItalian)} className={`cat-btns ${italian ? 'on' : 'off'}`}>Italian</button>
            <button onClick={() => handleCategory(bar, setBar)} className={`cat-btns ${bar ? 'on' : 'off'}`}>Bar</button>
            <button onClick={() => handleCategory(seafood, setSeafood)} className={`cat-btns ${seafood ? 'on' : 'off'}`}>Seafood</button>
            <button onClick={() => handleCategory(german, setGerman)} className={`cat-btns ${german ? 'on' : 'off'}`}>German</button>
            <button onClick={() => handleCategory(asianFusion, setAsianFusion)} className={`cat-btns ${asianFusion ? 'on' : 'off'}`}>Asian Fusion</button>
            <button onClick={() => handleCategory(brunch, setBrunch)} className={`cat-btns ${brunch ? 'on' : 'off'}`}>Brunch</button>
            <button onClick={() => handleCategory(deli, setDeli)} className={`cat-btns ${deli ? 'on' : 'off'}`}>Deli</button>
          </div>
      </div>
      <div className='category-business-container'>
        {selectedBusiness?.map(business => {
          // const categories = Array.isArray(business.category) ? business.category : JSON.parse(business.category);
          return (
            <NavLink to={`/business/${business.id}`} className='cat-business-card' key={business.id}>
              <img className='cat-image'src={business.businessImages[0].url} alt={business.title}/>
              <div>
                <h2 className="cat-card-title">{business.title}</h2>
                <div className='cat-rev-ratings'>
                  <p className="cat-rating">{renderStars(businessAvgRating(business?.id))}</p>
                  <p className='rating-num'>{businessAvgRating(business?.id)}</p>
                </div>
                <p className="cat-price-rating">{renderPriceRating(business.price_rating)}</p>
                <p><span className="cat-card-titles"></span> {business.category.split('"')}</p>
                <div><span className="cat-card-About"></span></div>
                <p className="cat-card-description">{business.description}</p>
              </div>
            </NavLink>
          );
        })}
      </div>
      </div>
    </>
  )
}
