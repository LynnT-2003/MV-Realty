"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChange, User } from "@/lib/firebase"; // Importing Firebase authentication functions

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user); // Set user state when authentication state changes
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Name: {user.displayName}</p>
          {/* You can display more user information here */}
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt="User"
            width={100}
            height={100}
          />
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default ProfilePage;
