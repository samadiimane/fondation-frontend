"use client";
import { useEffect, useState } from "react";

const Preloader = () => {
  let [active, setActive] = useState(true);
  useEffect(() => {
    setTimeout(function () {
      setActive(false);
    }, 500);
  }, []);
  return (
    <>
      {active ? (
        <div className='preloader'>
          <h3>AKT Research Foundation</h3>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default Preloader;
