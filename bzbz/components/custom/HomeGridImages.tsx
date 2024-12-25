import React from 'react'
import AfroSamurai from "../../public/afro_sam.jpg"
import Image from 'next/image';

export default function HomeGridImages() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 w-full justify-items-center">
        <div className="col-span-2 sm:col-span-2 h-[190px] w-full">
            <Image src={AfroSamurai} alt="Afro samurai" className='object-cover h-full rounded-2xl' />
        </div>
        <div className="col-span-1 sm:col-span-3 h-[190px] w-full">
            <Image src={AfroSamurai} alt="Afro samurai" className='object-cover h-full rounded-2xl' />
        </div>
    </div>
  )
}
