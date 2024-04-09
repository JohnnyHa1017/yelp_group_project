import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import bleach from '../../images/bleach.png'
import MHplatter from '../../images/MHplatter.jpg'
import MHplatter2 from '../../images/MHplatter2.png'
import Op from '../../images/OP.png'
import stardew from '../../images/stardew.jpeg'
import './Carousel.css'

console.log(React)
function ImageCarousel() {
    return (
        <>
                <Carousel className='main-slide'
                    autoPlay infiniteLoop interval={2000}
                    showThumbs={false}
                    showArrows={false}
                    showStatus={false}
                    transitionMode="fade"
                >
                    <div>
                        <img src={bleach} height='500px' width='300px' />
                    </div>
                    <div>
                        <img src={MHplatter} height='500px' width='300px' />
                    </div>
                    <div>
                        <img src={MHplatter2} height='500px' width='300px' />
                    </div>
                    <div>
                        <img src={Op} height='500px' width='300px' />
                    </div>
                    <div>
                        <img src={stardew} height='500px' width='300px' />
                    </div>
                </Carousel>
        </>
    )
}

export default ImageCarousel
