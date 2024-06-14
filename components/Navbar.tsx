"use client"
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import {signInWithGoogle, signOutUser, onAuthStateChange, User } from "@/lib/firebase"
import { onAuthStateChanged } from 'firebase/auth';

const navLists = ["Home", "Properties", "Agents", "Blog"]

const Navbar = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChange((user) => {
            if (user) { 
                setUser(user)
            } else {
                setUser(null)
            }
        })
        // Clean-up subscription on
        return () => unsubscribe();
    })
    
    const handleSignIn = async () => {
        await signInWithGoogle();
        console.log("Sign-in successful!")
    };

    const handleSignOut = async () => {
        await signOutUser();
        console.log("Sign-out successful!")
    }

    return (
      <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
        <nav className="flex w-full screen-max-width">
          
          {user ? (
            <div className='flex screnn-max-width items-center'>
                <img src={user.photoURL || "/default-avatar.png"} alt={user.displayName || "User"} width={32} height={32} className="rounded-full" />
                <span className="ml-2 text-sm">{user.displayName}</span>
            </div>
          ): (
            <div className='flex items-center'>
                 <img src="/next.svg" alt="Apple" width={18} height={18} />
            </div>
          )}

          <div className="flex flex-1 justify-center items-center max-sm:hidden">
            {navLists.map((nav, i) => (
              <div
                key={nav}
                className="px-5 text-sm cursor-pointer text-gray hover:font-light hover:text-base hover:text-slate-500 transition-all"
                onClick={() => router.push(`/${nav}`)}
              >
                {nav}
              </div>
            ))}
          </div>
  
          <div className="flex items-baseline gap-7 max-sm:justify-end max-sm:flex-1 ">
            {/* <Button onClick={handleSignIn}>Sign in</Button> */}
            {user ? (
                <Button onClick={handleSignOut}>Sign Out</Button>
            ) : (
                <Button onClick={handleSignIn}>Sign In</Button>
            )}
            <img src="/vercel.svg" alt="bag" width={18} height={18} />
          </div>
        </nav>
      </header>
    )
}

export default Navbar