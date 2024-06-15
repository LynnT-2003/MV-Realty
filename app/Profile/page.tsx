"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChange, User } from "@/lib/firebase";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user); // Set user state when authentication state changes
    });

    // Clean up subscription
    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-12 mx-6">
      {openEdit ? (
        <div>
          <div className="px-4 space-y-6 md:px-6">
            <header className="space-y-1.5">
              <div className="flex items-center space-x-4">
                <img
                  src={user?.photoURL || ""}
                  alt="Avatar"
                  width="96"
                  height="96"
                  className="border rounded-full"
                />
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold">{user?.displayName}</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </header>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      disabled
                      type="disabled"
                      id="name"
                      placeholder="Enter your name"
                      defaultValue={user?.displayName || ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      disabled
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      defaultValue={user?.email || ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone"
                      type="tel"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-6">
                <h2 className="text-lg font-semibold">Change Password</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      placeholder="Enter your current password"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      placeholder="Enter your new password"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      placeholder="Confirm your new password"
                      type="password"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 flex space-x-4">
              <Button
                size="lg"
                variant="destructive"
                onClick={() => {
                  setOpenEdit(false);
                }}
              >
                Cancel
              </Button>
              <Button size="lg" className="bg-slate-500">
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="px-4 space-y-6 md:px-6">
            <header className="space-y-1.5">
              <div className="flex items-center space-x-4">
                <img
                  src={user?.photoURL || ""}
                  alt="Avatar"
                  width="96"
                  height="96"
                  className="border rounded-full"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center">
                    <h1 className="text-2xl font-bold">{user?.displayName}</h1>
                    <FaEdit
                      className="ml-3 h-5 w-5 text-blue-800"
                      onClick={() => {
                        setOpenEdit(true);
                        console.log("Editing...");
                      }}
                    />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </div>
            </header>
            <div className="mt-8 flex space-x-5">
              <Button size="lg" variant="destructive">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
