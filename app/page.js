"use client"; // Ensure this is a client-side component

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react"; // Import useState to control button state
import { api } from "@/convex/_generated/api";
import { RedirectToSignIn, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useUser();
  const createUser = useMutation(api.user.createUser);
  const { push } = useRouter();
  const { isLoaded } = useClerk();

  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted
  const [showSignIn, setShowSignIn] = useState(false); // Track if "Get Started" button was clicked

  useEffect(() => {
    setIsMounted(true); // Set mounted to true when component is mounted
  }, []);

  useEffect(() => {
    if (user) {
      CheckUser();
    }
  }, [user]);

  const CheckUser = async () => {
    const result = await createUser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageUrl: user?.imageUrl,
      userName: user?.fullName,
    });
  };

  const handleWorkspaceRedirect = () => {
    push("/dashboard");
  };

  // Ensure component is client-side rendered before using useRouter
  if (!isMounted) {
    return null; // Prevent render on the server
  }

  return (
    <div className="flex min-h-screen flex-col justify-center items-center text-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-8">
      <h4 className="text-4xl font-extrabold mb-6">AI-PDF-NOTES</h4>
      <nav className="flex space-x-8 mb-12 text-lg font-semibold">
        <Button variant="ghost" className="text-white hover:text-gray-300">
          Features
        </Button>
        <Button variant="ghost" className="text-white hover:text-gray-300">
          Solutions
        </Button>
        <Button variant="ghost" className="text-white hover:text-gray-300">
          Testimonials
        </Button>
        <Button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500">
          Get Started
        </Button>
      </nav>

      {/* Button to show Clerk Sign In */}
      {!showSignIn ? (
        <Button
          className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-8 hover:bg-blue-400"
          onClick={() => setShowSignIn(true)} // Show the sign-in when clicked
        >
          Get Started
        </Button>
      ) : (
        // Show the Clerk Sign-In Page
        <RedirectToSignIn>
          <div className="text-center">
            <h3 className="text-xl mb-4">Please Sign In to Get Started</h3>
          </div>
        </RedirectToSignIn>
      )}

      {/* If user is authenticated, show UserButton and workspace button */}
      {user && (
        <div>
          <h3 className="text-2xl mb-4 font-semibold">
            Hello, {user.fullName}
          </h3>
          {user && (
            <div className="absolute top-4 right-4">
              <UserButton />
            </div>
          )}

          {/* Button to navigate to the workspace page */}
          <Button
            onClick={handleWorkspaceRedirect}
            className="bg-green-500 text-white px-6 py-3 rounded-lg mt-6 hover:bg-green-400"
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
