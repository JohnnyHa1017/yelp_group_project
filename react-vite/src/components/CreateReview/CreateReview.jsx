import CreateNewReview from "../ReviewForm/ReviewForm";
import './CreateReview.css'
const CreateReview = () => {
    const buttonName = 'Create Review'

    const review = {
        review: '',
        star:'',
        image:''
    }

    return (
        <>
            <h1 className='review-form-header'>Create a Review</h1>
            <div>
            <CreateNewReview reviewToUpdate={review} buttonName={buttonName}/>
            </div>
        </>
    )
}

export default CreateReview
