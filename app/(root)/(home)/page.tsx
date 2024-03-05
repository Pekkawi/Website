import Image from "next/image";
import React from "react";

const Home = () => {
  return (
    <>
      <div>
        <h1>This is the official Weeb home page of the Core </h1>
        <h1> And Several Bootiful pictures of our boss Andrei</h1>

        <div className=" flex flex-1 max-sm:flex-col">
          <Image
            src="/assets/images/Andrei1.jpg"
            width={300}
            height={300}
            alt="Andrei1"
            className="rounded-lg shadow-light-300 max-sm:my-20 sm:mx-10"
          />
          <Image
            src="/assets/images/Andrei2.png"
            width={300}
            height={300}
            alt="Andrei2"
            className="rounded-lg shadow-light-300 max-sm:mb-20  sm:mx-10"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
