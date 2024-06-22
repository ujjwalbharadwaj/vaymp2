import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);

  // Filter products where listing is not equal to "Event"
  const filteredProducts = allProducts.filter((product) => product.listing !== "Event");

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
        <h1 className="text center mb-2">Featured Products</h1>
        </div>
        <div
          // className="flex overflow-x-auto scroll-snap-x snap-mandatory gap-5 mb-12 border-0"
          className="flex overflow-x-auto overflow-y-hidden scroll-snap-x snap-mandatory gap-5 mb-12 border-0"
          style={{
            scrollbarWidth: 'none',   /* Firefox */
           msOverflowStyle: 'none',  /* Internet Explorer 10+ */
            WebkitOverflowScrolling: 'touch',  /* Smooth scrolling for mobile devices */
            '&::-webkit-scrollbar': { display: 'none' }  /* Hide scrollbar for WebKit browsers */
          }}
        >
          {allProducts && allProducts.length !== 0 && (
            <>
              {allProducts.map((product, index) => (
                  <div className="snap-center shrink-0 w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/6" key={index}>                  
                  <ProductCard data={product} />
                </div>
              ))}
              </>
            )
           }
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
