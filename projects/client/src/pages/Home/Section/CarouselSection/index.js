import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"
import banner1 from './assets/banner1.png'
import banner2 from './assets/banner2.png'
import banner3 from './assets/banner3.png'

const CarouselSection = () => {
  return (
    <div className='w-[375px] h-[119px]'>
            <Carousel showThumbs={false} showStatus={false} className='z-5'>
                <div>
                    <img src={banner1} />
                </div>
                <div>
                    <img src={banner2} />
                </div>
                <div>
                    <img src={banner3} />
                </div>
            </Carousel>
        </div>
  )
}

export default CarouselSection