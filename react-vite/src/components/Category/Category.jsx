
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { landingPageThunk } from "../../redux/business";
import { BiSolidBadgeDollar } from "react-icons/bi";



export default function Category() {
  const dispatch = useDispatch()
  const { category } = useParams()

  const businesses = useSelector(state => state.business?.Business)
  const selectedBusiness = businesses?.filter(ele => ele.category.includes(category))
  console.log('selectedBusiness ==>', selectedBusiness)

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

  return (
    <>  <h1>{category}</h1>
      <div className='all-business-container'>

        {selectedBusiness?.map(business => {
          // const categories = Array.isArray(business.category) ? business.category : JSON.parse(business.category);
          return (
            <NavLink to={`/business/${business.id}`} className='business-card' key={business.id}>
              <h2 className="landing-card-title">{business.title}</h2>
              <p className="landing-price-rating">{renderPriceRating(business.price_rating)}</p>
              <p><span className="landing-card-titles">Phone Number:</span> {business.phone_number}</p>
              <p><span className="landing-card-titles">Country:</span> {business.country}
                <p></p><span className="landing-card-titles">State:</span> {business.state} <span className="landing-card-titles">City:</span> {business.city}</p>
              <p><span className="landing-card-titles">Address:</span> {business.address}</p>
              <p><span className="landing-card-titles">Categories:</span> {business.category.split('"')}</p>
              <div><span className="landing-card-About">About:</span></div>
              <p className="landing-card-description">{business.description}</p>
            </NavLink>
          );
        })}
      </div>
    </>


  )
}
