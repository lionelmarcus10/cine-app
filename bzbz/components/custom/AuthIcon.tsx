"use client";
import { UserRoundPen } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

export default function AuthIcon() {
  return (
    <div onClick={()=> redirect("/authentication")} className="p-2 bg-white transition-transform active:scale-95 backdrop-blur-3xl rounded-full">
        <UserRoundPen className='text-neutral-600' width={20} height={20} />
    </div>
  )
}
