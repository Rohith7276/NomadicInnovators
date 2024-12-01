import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react'
import { useForm } from "react-hook-form"
import { auth } from '../firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

const SignIn = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
      } = useForm();
      const onSubmit = async (data) => {
        const result = await signInWithEmailAndPassword(auth, data.username, data.password)
        localStorage.setItem('user', JSON.stringify(result))
        router.push('/')
      }
return (
    <> 
    {isSubmitting && <div className="text-center text-blue-500">Loading...</div>}
         <div className="container mx-auto p-4">
            <form className="bg-wdfshite gap-5 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="Email">
                        Email
                    </label>
                    <input 
                        placeholder='username' 
                        className='shadow appearance-none  bg-[#1e0700] border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline' 
                        {...register("username", { required: {value: true, message: "This field is required"}, minLength: {value: 3, message: "Min length is 3"} })} 
                        type="text"   
                    />
                    {errors.username && <div className='text-red-500 text-xs italic'>{errors.username.message}</div>}
                </div>
                <div className="mb-6">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input 
                        placeholder='password'  
                        className='shadow appearance-none bg-[#1e0700] border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline' 
                        {...register("password", {minLength: {value: 7, message: "Min length of password is 7"},})} 
                        type="password"
                    />
                    {errors.password && <div className='text-red-500 text-xs italic'>{errors.password.message}</div>}
                </div>
                <div className="flex items-center justify-between bg-blue-700 w-fit cursor-pointer">
                    <input 
                        disabled={isSubmitting} 
                        className=' bg-[#1e0700] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' 
                        type="submit" 
                        value="Submit" 
                    />
                </div>
                {errors.myform && <div className='text-red-500 text-xs italic mt-4'>{errors.myform.message}</div>}
                {errors.blocked && <div className='text-red-500 text-xs italic mt-4'>{errors.blocked.message}</div>}
            </form>
         </div>
    </>
)
}

export default SignIn
