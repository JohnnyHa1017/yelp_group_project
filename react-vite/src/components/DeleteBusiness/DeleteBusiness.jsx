import { deleteBusinessThunk, specificBusinessThunk } from "../../redux/business"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom';
import {  useEffect } from "react";
import { useModal } from "../../context/Modal";
import './DeleteBusiness.css'

function DeleteBusiness({businessId, reRenderOnDelete}) {
    const state = useSelector(state => state.business)
    const currUser = useSelector(state => state.session.user)
    const dispatch = useDispatch();
    const nav = useNavigate()
    const { closeModal } = useModal()


    useEffect(()=>{
        if(!currUser){
            nav('/')
        }
        dispatch(specificBusinessThunk(businessId))
    }, [businessId, dispatch])

    const deleteBusiness = async (e) => {
        e.preventDefault();
        dispatch(deleteBusinessThunk(state[businessId]))
        closeModal()
        reRenderOnDelete()
        nav(`/user/${currUser.id}/business`)
    }

    return(
        <div className='delete-business-modal'>
            <div className='delete-form-container'>
                <h1 className='remove-business-title'>Are you sure you want to remove this business from Munch?</h1>
                <button className='delete-modal-btn confirm-delete-btn' onClick={deleteBusiness}>Yes (Delete Business)</button>
                <button className='delete-modal-btn' onClick={closeModal}>Cancel</button>
            </div>
        </div>
    )
}

export default DeleteBusiness
