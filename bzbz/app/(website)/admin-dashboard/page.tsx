import { AdminSidebar } from '@/components/custom/AdminSidebar'
import React from 'react'

export default async function Page() {
  const img_base_url = `${process.env.TMDB_IMG_URL}/${process.env.TMDB_IMG_THUMB_SIZE}`

  return (
    <AdminSidebar  baseurl={img_base_url}/>
  )
}
