import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { BsShop } from "react-icons/bs";

const ShopCard = ({ shopName, image, shopId }) => {
  return (
    <div className="max-w-sm mx-auto overflow-hidden shadow-lg rounded-lg">
<BsShop className="w-full h-56 object-contain object-center"  alt={shopName} />      
<div className="px-6 py-4">
        <Link to={`/shop/preview/${shopId}`}>
          <h5 className={`${styles.shop_name}`}>{shopName}</h5>
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;