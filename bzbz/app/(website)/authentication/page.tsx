import { verifySession } from '@/lib/jwt-actions'
import { Sparkle } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation'

export default async function page() {
  const session = await verifySession();
  
  if (session) {
    redirect("/admin-dashboard");
  }

  return (
    <div className="place-content-center place-items-center py-40 bg-red-500 flex">
      <div className="w-full bg-[#E9E9E9] flex border-2 backdrop-blur-lg rounded-2xl shadow-lg p-2 max-w-[810px] h-full max-h-[600px]">
        <Image alt='test' src={"/wbg.png"} width={470} height={600} className='rounded-s-2xl max-md:hidden' />
        <div className="bg-white !w-[340px] rounded-xl flex-col  py-9 px-14">
          <div className="space-y-12 bg-red-500 w-full place-items-center">
            <div className="pt-2 pb-1">
            <Sparkle width={30} height={30} />
            </div>
            <div className="text-center space-y-3">
              <h1 className="font-bold text-2xl">Welcome back!</h1>
              <p className='text-[#E9E9E9] font-semibold text-xs'>Please enter your details</p>
            </div>
          </div>
          <div className="bg-green-500">
            <form action="">
              <p>Email</p>
              <p>Password</p>
            </form>
          </div>
        </div>
      </div>
    </div> 
  )

}