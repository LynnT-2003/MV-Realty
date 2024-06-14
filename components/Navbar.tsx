"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  signInWithGoogle,
  signOutUser,
  onAuthStateChange,
  User,
} from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const navLists = ["Home", "Buy", "Rent"];

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setUser(user);
        console.log("User is now: ", user);
      } else {
        setUser(null);
      }
    });
    // Clean-up subscription on
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      console.log(
        "POSTING THESE FUCKING INFORMATION TO BACKEND",
        user.email,
        user.displayName
      );
      postUserToBackend(user);
    }
  }, [user]);

  const handleSignIn = async () => {
    await signInWithGoogle();
    console.log("Sign-in successful!");
  };

  const handleSignOut = async () => {
    await signOutUser();
    console.log("Sign-out successful!");
  };

  // Function to post user credentials to the backend
  const postUserToBackend = async (userData: User) => {
    try {
      const response = await fetch("http://localhost:8080/add/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Assuming user contains necessary fields like email, name, etc.
          email: userData?.email,
          name: userData?.displayName,
          // Add other fields if needed
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
      console.log("User added successfully!");
    } catch (error) {
      console.error("Error adding user:");
    }
  };

  return (
    <header className="w-full py-5 sm:px-10 px-5 flex justify-between items-center">
      <nav className="flex w-full screen-max-width">
        {user ? (
          <div className="flex screen-max-width items-center">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt={user.displayName || "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="ml-2 text-sm">{user.displayName}</span>
          </div>
        ) : (
          <div className="flex items-center">
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
  );
};

export default Navbar;
