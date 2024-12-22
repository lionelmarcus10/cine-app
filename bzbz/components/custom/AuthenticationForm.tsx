"use client"
import login from '@/app/actions/login.action'
import { useToast } from '@/hooks/use-toast'
import { clsx } from 'clsx'
import { Eye, EyeClosed } from 'lucide-react'
import React, { useActionState,  useEffect,  useState } from 'react'

export default function AuthenticationForm() {
  const [ displayPass, setDisplayPass ] = useState(false)
  const  [ error, action, isPending ] = useActionState(login , null)
  const { toast } = useToast()
  
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error,
      });
    }
  }, [error]);

  

  return (
    <form action={action} className='flex-col space-y-7'>
        <div className={clsx("relative border-b-[2.25px] border-neutral-500 flex", error && "!border-red-500")}>
            <input 
                type="email" 
                id="email" 
                name='email'
                placeholder=' ' 
                className='placeholder:text-transparent not-placeholder-shown:pb-1.5 not-placeholder-shown:pt-1 outline-none pb-3 focus:pb-1.5 focus:pt-1 active:pt-1 peer' 
            />
            <label 
                htmlFor="email" 
                className={clsx("absolute left-0 text-sm not-placeholder-shown:-top-4 transition-all duration-200 transform scale-75 origin-top-left text-[#000] peer-focus:-top-4 peer-focus:scale-75 peer-focus:text-[#000] peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-[#000] cursor-text")}>
                Email
            </label>
        </div>
        <div className={clsx("relative border-b-[2.25px] border-neutral-500 flex", error && "!border-red-500")}>
            <input 
                type={ displayPass ? 'text' : 'password'} 
                id="password" 
                name='password'
                placeholder=' ' 
                className='placeholder:text-transparent not-placeholder-shown:pb-1.5 not-placeholder-shown:pt-1 outline-none pb-3 focus:pb-1.5 focus:pt-1 active:pt-1 peer' 
            />
            <label 
                htmlFor="password" 
                className="absolute left-0 text-sm not-placeholder-shown:-top-3 transition-all duration-200 transform scale-75 origin-top-left text-[#000] peer-focus:-top-3 peer-focus:scale-75 peer-focus:text-[#000] peer-placeholder-shown:top-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-[#000] cursor-text">
                Password
            </label>
            <div className="my-auto">
            { displayPass ? <Eye onClick={() => setDisplayPass(false)} /> : <EyeClosed onClick={() => setDisplayPass(true)} /> }
            </div>
        </div>
        <div className="pt-4">
            <button onClick={() => {
                
            }} type='submit' className={clsx('bg-black text-white text-sm w-full py-2 rounded-3xl transition-transform hover:scale-95 cursor-pointer',  isPending && "opacity-50 !bg-neutral-500" )} disabled={isPending}>Log in</button>
        </div>
    </form>
  )
}