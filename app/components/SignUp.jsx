import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react'
import { useForm } from "react-hook-form"
import {auth, fireDB} from '../firebase/firebaseConfig' 
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
const SignUp = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,    
    formState: { errors, isSubmitting },
  } = useForm();
  const router = useRouter();
  const onSubmit = async (data) => {
   
    // const auth = getAuth();
    try {
      const users = await createUserWithEmailAndPassword(auth, data.email, data.password);
     
      const uniqueId = uuidv4();
      const user = {
          name: data.name,
          email: data.email,
          uid: uniqueId,
        }
        
        const userRef = collection(fireDB, "users");
        await addDoc(userRef, user);
        localStorage.setItem("user", JSON.stringify(user));
        router.push('/')
        
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <> 
    {isSubmitting && <div  className="   text-center text-blue-500">Loading...</div>}
         <div  className="   container mx-auto p-4">
            <form  className="    gap-5 sfdhadow-md rounded px-8 pt-6  mb-4" onSubmit={handleSubmit(onSubmit)}>
                <div  className="   mb-6">
                    <label  className="   block  text-white text-sm font-bold mb-2" htmlFor="Name">
                        Name
                    </label>
                    <input 
                        placeholder='username' 
                        className='  shadow appearance-none bg-white  border rounded w-full py-2 px-3 text-black  leading-tight focus:outline-none focus:shadow-outline' 
                        {...register("name", { required: {value: true, message: "This field is required"}, minLength: {value: 3, message: "Min length is 3"}, maxLength: {value: 8, message: "Max length is 8"} })} 
                        type="text"   
                    />
                    {errors.name && <div className='  text-red-500 text-xs italic'>{errors.name.message}</div>}
                </div>
                <div  className="   mb-6">
                    <label  className="   block text-white text-sm font-bold mb-2" htmlFor="Email">
                        Email
                    </label>
                    <input 
                        placeholder='email' 
                        className='  shadow appearance-none bg-white   border rounded w-full py-2 px-3 text-black darktext-white leading-tight focus:outline-none focus:shadow-outline' 
                        {...register("email", { required: {value: true, message: "This field is required"}, minLength: {value: 3, message: "Min length is 3"} })} 
                        type="text"   
                    />
                    {errors.username && <div className='  text-red-500 text-xs italic'>{errors.username.message}</div>}
                </div>
                <div  className="   mb-6">
                    <label  className="   block text-white text-sm font-bold mb-2" htmlFor="password">
                        Password
                        </label>
                    <div  className="   relative">
                        <input 
                            placeholder='password'  
                            className='  shadow appearance-none border bg-white  rounded w-full py-2 px-3 text-black  mb-3 leading-tight focus:outline-none focus:shadow-outline' 
                            {...register("password", {minLength: {value: 7, message: "Min length of password is 7"},})} 
                            type={showPassword ? "text" : "password"}
                        />
                        <span  className="   absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5  " onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <svg  className="   h-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.823-.676 1.597-1.186 2.29M15 12a3 3 0 01-6 0m6 0a3 3 0 01-6 0m6 0a3 3 0 01-6 0m6 0a3 3 0 01-6 0" />
                                </svg>
                            ) : (
                                <svg  className="   h-6 text-gray-500" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.823-.676 1.597-1.186 2.29M15 12a3 3 0 01-6 0m6 0a3 3 0 01-6 0m6 0a3 3 0 01-6 0m6 0a3 3 0 01-6 0" />
                                </svg>
                            )}
                        </span>
                    </div>
                    {errors.password && <div className='  text-red-500 text-xs italic'>{errors.password.message}</div>}
                </div>
                <div  className="   flex items-center justify-between amsterdam tracking-widest rounded-[10rem] bg-[#031a2c]  dark:bg-yellow-600 w-fit  ">
                    <input 
                        disabled={isSubmitting} 
                        className='   bg-white dark:bg-[#1e0700] text-white font-bo ld py-1 px-4   rounded focus:outline-none focus:shadow-outline' 
                        type="submit" 
                        value="Submit" 
                    />
                </div>
                {errors.myform && <div className='  text-red-500 text-xs italic mt-4'>{errors.myform.message}</div>}
                {errors.blocked && <div className='  text-red-500 text-xs italic mt-4'>{errors.blocked.message}</div>}
            </form>
         </div>
    </>
  )
}

export default SignUp
