import { verifySession } from '@/lib/jwt-actions'
import { unauthorized } from 'next/navigation'
import React from 'react'

export default async function Page() {
  
  return (
    <div>
      <p>Hellow world you are an admin</p>
    </div>
  )
}
