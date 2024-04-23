import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useState, useEffect, useRef } from "react";
import { useSelector } from 'react-redux';
import "./Navigation.css";
import landinglogo from '../../images/landinglogo.png'
// import SearchBar from "../SearchBar/SearchBar";
// import { thunkLogout } from "../../redux/session";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "./OpenModalMenuItem";
// import { useNavigate } from "react-router-dom";

function Navigation() {
  const user = useSelector(state => state.session.user)
  const [showMenu, setShowMenu] = useState(false);
  // const dispatch = useDispatch()
  const ulRef = useRef();
  // const nav = useNavigate()

  // const toggleMenu = (e) => {
  //   e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
  //   setShowMenu(!showMenu);
  // };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(thunkLogout());
  //   closeMenu();
  //   nav('/')
  // };

  return (
    <div className='nav-container'>
      <div className='background-shadow'></div>
      <ul className='nav-bar-ul'>
        <li className='LandingLogo-container'>
          <NavLink to="/" className='Landinglogo'>
            <img src={landinglogo} alt='landinglogo'/>
          </NavLink>
        </li>
        {/* <li className='search-component'>
          <SearchBar/>
        </li> */}
        {user && (
          <div className='nav-btn-container'>
            <li className='nav-btn'>
              <NavLink to='/business/new'className='Nav-btn'>Create a New Business</NavLink>
            </li>
            <li className='nav-btn'>
              <NavLink to={`/user/${user.id}/business`} className='Nav-btn'>Manage Your Business</NavLink>
            </li>
          </div>
          )
        }
        {user ? (
          <li>
            <ProfileButton />
          </li>
          ) : (
            <div className='logged-btns'>
              <OpenModalMenuItem
                itemText={<span className='nav-login-btn'>Log In</span>}
                onItemClick={closeMenu}
                className="dropdown-text-login-btn"
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText={<span className='nav-signup-btn'>Sign Up</span>}
                onItemClick={closeMenu}
                className="dropdown-text-signup-btn"
                modalComponent={<SignupFormModal />}
              />
            </div>
          )}
      </ul>
    </div>
  );
}

export default Navigation;
