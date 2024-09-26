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

// const navLists = ["Buy", "Rent"];

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
      const checkResponse = await fetch(
        // here
        `https://mv-realty-backend-production.up.railway.app/check/user?email=${userData.email}`
      );
      const userExists = await checkResponse.json();

      if (userExists.exists) {
        console.log("User already exists, not POSTING user credentials again.");
        return;
      }

      // here
      const response = await fetch(
        "https://mv-realty-backend-production.up.railway.app/add/user",
        {
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
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
      console.log("User added successfully!");
    } catch (error) {
      console.error("Error adding user:");
    }
  };

  return (
    <div className="w-screen flex justify-center">
      <header className="md:px-0 px-5 w-[1320px] py-2 mb-3 flex justify-between items-center">
        <nav className="flex w-full screen-max-width">
          <div className="flex flex-1 items-center ">
            <div className="md:pr-15 py-1 pr-5 cursor-pointer">
              <img
                src="/logo.png"
                width={128}
                onClick={() => router.push("/")}
              />
            </div>

            {/* {navLists.map((nav, i) => (
              <div
                key={nav}
                className="md:px-5 pl-4 text-sm cursor-pointer text-gray hover:font-light hover:text-base hover:text-slate-500 transition-all"
                onClick={() => router.push(`/${nav}`)}
              >
                {nav}
              </div>
            ))} */}
          </div>
        </nav>
        <div className="flex gap-0 justify-center items-center">
          {/* <Button onClick={handleSignIn}>Sign in</Button> */}
          {user ? (
            <div className="flex screen-max-width items-center">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt={user.displayName || "User"}
                className="rounded-full md:w-12 w-12"
                onClick={() => router.push("/Profile")}
              />
              {/* <span className="ml-2 text-sm">{user.displayName}</span> */}
            </div>
          ) : (
            <div className="flex items-center"></div>
          )}
          {/* {user ? (
            <Button
              className="ml-3 p-2 bg-background text-black hover:bg-slate-100 max-sm:hidden"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <Button onClick={handleSignIn}>Sign In</Button>
          )} */}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
