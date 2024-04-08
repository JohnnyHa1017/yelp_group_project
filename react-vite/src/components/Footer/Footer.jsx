import './Footer.css'
import { IoLogoGithub } from "react-icons/io5";
import { BsLinkedin } from "react-icons/bs";


function Footer(){
    return(
        <div className='footer-container'>
            <div className='footer-top'>
                <h2 className='contactus-txt'>Contact Us</h2>
                <a href='https://github.com/JohnnyHa1017/munch' target='_blank' rel="noreferrer" className='footer-link munch-git'><IoLogoGithub className='github-logo munch-logo'/>Munch</a>
            </div>
            <div className='contacts-container'>
                <div className='contacts'>
                    <a href='https://github.com/JohnnyHa1017' target='_blank' rel="noreferrer"  className='footer-link'><IoLogoGithub className='github-logo'/>JohnnyHa1017</a>
                    <a href='https://www.linkedin.com/in/johnny-ha-7710b4303/?trk=public-profile-join-page' target='_blank' rel="noreferrer" className='footer-link'><BsLinkedin className='linkedin-logo'/>Johnny Ha</a>
                </div>
                <div className='contacts'>
                    <a href='https://github.com/TylerHan1226' target='_blank' rel="noreferrer" className='footer-link'><IoLogoGithub className='github-logo'/>TylerHan1226</a>
                    <a href='https://www.linkedin.com/in/tyler-han-2a3684254/' target='_blank' rel="noreferrer" className='footer-link'><BsLinkedin className='linkedin-logo'/>Tyler Han</a>
                </div>
                <div className='contacts'>
                    <a href='https://github.com/MoonChopperr' target='_blank' rel="noreferrer" className='footer-link'><IoLogoGithub className='github-logo'/>MoonChopperr</a>
                    <a href='https://www.linkedin.com/in/jornen-nishiyama-4b04aa1b4/' target='_blank' rel="noreferrer" className='footer-link'><BsLinkedin className='linkedin-logo'/>Jornen (Ryou) Nishiyama</a>
                </div>
                <div className='contacts'>
                    <a href='https://github.com/jtruong97' target='_blank' rel="noreferrer" className='footer-link'><IoLogoGithub className='github-logo'/>Jtruong97</a>
                    <a href='https://www.linkedin.com/in/jas-truong/' target='_blank' rel="noreferrer" className='footer-link'><BsLinkedin className='linkedin-logo'/>Jasmine Truong</a>
                </div>
            </div>
        </div>
    )
}

export default Footer;
