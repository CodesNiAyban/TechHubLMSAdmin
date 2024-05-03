"use client"

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import TechHubLogo from "../../public/assets/logo-no-background.svg";
import UserButton from "./auth/user-button";
import { Button } from "./ui/button";

export default function NavBar() {
  const session = useSession();
  const user = session?.data?.user;

  return (
    <header className="sticky w-full top-0 bg-background px-3 shadow-sm" style={{ zIndex: 999 }}>
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3">
        <Link href="/auth/login" className="font-bold">
          <div className="top-0 left-0">
            <div className="w-14 h-14 ">
              <Image src={TechHubLogo} className="w-full h-full" alt="TechHub Logo" />
            </div>
          </div>
        </Link>
        {user && <UserButton user={user} />}
        {!user && session.status !== "loading" && <SignInButton />}
      </nav>
    </header>
  );
}

function SignInButton() {
  return (
    <Button onClick={() => signIn()}>Sign up</Button>
  )
}