import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useSelector } from 'react-redux';
import "./Navigation.css";
import landinglogo from '../../images/landinglogo.png'
import SearchBar from "../SearchBar/SearchBar";

function Navigation() {
  const user = useSelector(state => state.session.user)


  return (
    <>
      <div className='background-shadow'></div>
      <ul className='nav-bar-ul'>
        <li className='LandingLogo-container'>
          <NavLink to="/" className='Landinglogo'>
            <img src={landinglogo} alt='landinglogo'/>
          </NavLink>
        </li>
        <li>
          <SearchBar className='search-component'/>
        </li>
        {user && (
          <div className='nav-btn-container'>
            <li>
              <NavLink to='/business/new'className='Nav-btn'>Create a New Business</NavLink>
            </li>
            <li >
              <NavLink to={`/user/${user.id}/business`} className='Nav-btn'>Manage Your Business</NavLink>
            </li>
          </div>
          )
        }
        <li>
          <ProfileButton />
        </li>
      </ul>
    </>
  );
}

export default Navigation;
