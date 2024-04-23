import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { NavLink } from 'react-router-dom';
import "./LoginForm.css";
import google from '../../images/google.png'

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  const loginDemo = (e) => {
    e.preventDefault()
    return dispatch(thunkLogin({email:'demo@aa.io', password:'password'}))
    .then(closeModal)
  }

  return (
    <>
      <h1>Log in to Munch</h1>
      <form onSubmit={handleSubmit} className='login-form'>
        <label className='login-label'>
          <input
            className="login-input"
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label className='login-label'>
          <input
            className="login-input"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <button className='login-btn' type="submit">Log In</button>
        <NavLink
          className='demo-login-btn'
          onClick={loginDemo}
          to='/'
        > Demo User </NavLink>
      </form>
      <a href={`${window.origin}/api/auth/oauth_login`} className='google-oauth'>
          <button className='google-login-btn'>
            <img src={google} alt='google-icon'className='google-logo'/>Login with Google
          </button>
      </a>
    </>
  );
}

export default LoginFormModal;
