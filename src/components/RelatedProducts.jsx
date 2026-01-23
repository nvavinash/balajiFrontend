import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => item.category === category && item.subCategory === subCategory);
      //   productsCopy = productsCopy.filter((item) => item.subCategory === subCategory); 
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-16">
      <div>
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-4 text-sm">
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name.slice(0, 15)}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
