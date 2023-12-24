import React from "react";

import { client } from "../lib/client";
import { Product, FooterBanner, HeroBanner } from "../components";

const Home = ({ products, otherProd, essentialProd, posters, bannerData }) => (
  <div>
    <HeroBanner heroBanner={bannerData.length && bannerData[0]} />
    <div className="products-heading">
      <h2>Essentials Collection</h2>
      <p>Collection Out Now</p>
    </div>

    <div className="products-container">
      {essentialProd?.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>

    <div className="products-heading">
      <h2>Ankh Logo Collection</h2>
      <p>Collection Out Now</p>
    </div>

    <div className="products-container">
      {otherProd?.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>

    <div className="products-heading">
      <h2>Poster Collection</h2>
      <p>Collection Out Now</p>
    </div>

    <div className="products-container">
      {posters?.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>

    <FooterBanner footerBanner={bannerData && bannerData[0]} />
  </div>
);

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const essentialProd = products.filter(
    (product) => product.name.includes("Essential") // Assuming 'name' contains the product name
  );

  const otherProd = products.filter(
    (product) =>
      !product.name.includes("Ankh Logo") && product.name.includes("Ankh") // Products that do not include 'Essential'
  );

  const posters = products.filter((product) => product.name.includes("Poster"));

  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, essentialProd, otherProd, posters, bannerData },
  };
};

export default Home;
