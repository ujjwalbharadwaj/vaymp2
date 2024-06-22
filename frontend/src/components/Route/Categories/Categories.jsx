import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div
          className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}
        >
          {brandingData &&
            brandingData.map((i, index) => (
              <div className="flex items-start" key={index}>
                {i.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                  <p className="text-xs md:text-sm">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
        id="categories"
      >
          <div className="flex flex-wrap justify-between gap-5 md:gap-10 lg:gap-20 xl:gap-30">          
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = () => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                className="w-1/4 md:-1/4 lg:w-1/4 xl:w-1/5 cursor-pointer"
                key={i.id}
                onClick={handleSubmit}
                >
                  {/* <h5 className={`text-[18px] leading-[1.3]`}>{i.title}</h5>
                  <img
                    src={i.image_Url}
                    className="w-[120px] object-cover"
                    alt=""
                  />
                </div> */}
              <div className="overflow-hidden relative">
              <h5 className="leading-1.3 absolute top-0 left-0 right-0 text-center font-bold text-black shadow p-4 text-[13px] sm:text-[15px] md:text-[24px]">{i.title}</h5>
                      <img
                      src={i.image_Url}
                      className="w-full lg:w-70% h-auto mt-24 lg:rounded-full lg:border lg:border-gray-300"
                      alt={i.title}
                    />
                  </div>
                </div>

              );
            })}
        </div>
      </div>
    </>
  );
};
export default Categories;