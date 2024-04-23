import CreateNewBusiness from "../BusinessForm/BusinessForm"
import './CreateBusiness.css'

const CreateBusiness = () => {
  const buttonName = 'Create a New Business'

  const business ={
    title: '',
    address: '',
    city: '',
    state: '',
    country: '',
    description: '',
    phone_number: '',
    price_rating: '',
    lat: '',
    lng: '',
    category: '',
    schedule: '',
    image: null
  }

  return (
    <>
      <h1 className="CR-bzns-title">Create Your New Business</h1>
      <CreateNewBusiness buttonName={ buttonName } business={ business }/>
    </>
    )
}

export default CreateBusiness
