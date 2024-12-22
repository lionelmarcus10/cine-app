import AuthenticationForm from '@/components/custom/AuthenticationForm';
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
    <div className="flex items-center justify-center h-screen w-full bg-white md:px-10">
      <div className="md:w-full md:bg-[#E9E9E9] max-md:border-black flex border-2 backdrop-blur-2xl rounded-2xl shadow-lg p-2 max-w-[810px] h-full max-h-[600px]">
        <div className="h-full py-24">
           <Image alt='image' src={"/wbg.png"} width={450} height={265} className='rounded-s-2xl max-md:hidden' />
        </div>
        <div className="bg-white w-72 min-[380px]:!w-[340px] rounded-xl flex-col py-9 px-8 min-[390px]:px-14">
          <div className="space-y-12 w-full place-items-center pb-8">
            <div className="pt-2 pb-1">
            <Sparkle width={30} height={30} />
            </div>
            <div className="text-center space-y-3">
              <h1 className="font-bold text-2xl">Welcome back!</h1>
              <p className='text-neutral-500 font-semibold text-xs'>Please enter your details</p>
            </div>
          </div>
          <div className="">
            <AuthenticationForm/>
          </div>
          <div className="pt-20">
            <p className='text-xs text-center'>Don&apos;t have an account ? Contact the administrator</p>
          </div>
        </div>
      </div>
    </div> 
  )

}