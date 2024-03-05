import Image from "next/image";
import React from "react";
import Link from "next/link";
import Theme from "./Theme";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <nav className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-6 dark:shadow-none sm:px-12 ">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/oshinoco.png"
          width={40}
          height={40}
          alt="core"
        />
        <p className=" h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 mx-5 max-sm:hidden">
          The <span className=" text-teal-500">Core</span>
        </p>
      </Link>
      <div className="flex-between gap-5">
        <Theme />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
