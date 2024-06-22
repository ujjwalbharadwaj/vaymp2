import React, { useEffect, useState } from "react";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import ShopCard from "../../components/ShopCard/ShopCard";
import { useSelector } from "react-redux";
import { BsShop } from "react-icons/bs";

const ShopsPage = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [shopList, setShopList] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      const uniqueShopIds = new Set();
      const uniqueShops = [];
      
      // Filter products where listing is not "Event"
      const filteredProducts = allProducts.filter((product) => product.listing !== "Event");

      filteredProducts.forEach((product) => {
        const shopId = product.shop._id;
        if (!uniqueShopIds.has(shopId)) {
          uniqueShopIds.add(shopId);
          uniqueShops.push(product.shop);
        }
      });
      setShopList(uniqueShops);
    }
  }, [allProducts, isLoading]);

  return (
    <>
      <Header activeHeading={5} />
      {isLoading ? (
        <h1>Loading</h1>
      ) : (
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Our Shops</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {shopList.map((shop) => (
              <ShopCard
                key={shop._id} 
                shopName={shop.name}
                shopId={shop._id}
              />
            ))}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ShopsPage;
