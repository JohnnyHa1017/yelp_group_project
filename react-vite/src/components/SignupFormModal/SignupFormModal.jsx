import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";
import google from '../../images/google.png'

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }
    if(!first_name){
      return setErrors({
        first_name:
          'Must enter your first name'
      })
    }
    if(!last_name){
      return setErrors({
        last_name:
          'Must enter your last name'
      })
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
        first_name,
        last_name,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1>Sign Up for Munch</h1>
      {errors.server && <p className="sign-up-errors">* {errors.server}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
      <label className='login-label'>
          <input
            className="signup-input"
            type="text"
            value={first_name}
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.first_name && <p className="sign-up-errors">* {errors.first_name}</p>}
        <label className='login-label'>
          <input
            className="signup-input"
            type="text"
            value={last_name}
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>

        <label className='login-label'>
          <input
            className="signup-input"
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="sign-up-errors">* {errors.email}</p>}
        <label className='login-label'>
          <input
            className="signup-input"
            type="text"
            value={username}
            placeholder="User Name"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="sign-up-errors">* {errors.username}</p>}
        <label className='login-label'>
          <input
            className="signup-input"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="sign-up-errors">* {errors.password}</p>}
        <label className='login-label'>
          <input
            className="signup-input"
            type="password"
            value={confirmPassword}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="sign-up-errors">* {errors.confirmPassword}</p>}
        <button className='signup-btn' type="submit">Sign Up</button>
      </form>
      <a href={`${window.origin}/api/auth/oauth_login`} className='google-oauth'>
          <button className='google-login-btn'>
            <img src={google} alt='google-icon'className='google-logo'/>Signup with Google
          </button>
      </a>
    </>
  );
}

export default SignupFormModal;
