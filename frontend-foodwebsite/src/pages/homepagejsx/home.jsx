import { Header } from "../headerpage/header";
import "./homepage.css";
import { useState } from "react";
import axios from "axios";
import weburl from "../../config/weblink.js";
import { ProductGrid } from "./prodcutGrid.jsx";
import { SubSection } from "./homeSubSection.jsx";
import { SearchBar } from "../utility/search.jsx";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "../profilePage/profileContainer.jsx";

const Home = ({ getOrderItems }) => {
  const [profile, setProfile] = useState(false);
  const [search, setSearch] = useState(false);
  const location = useLocation();
  const name = new URLSearchParams(location.search).get("name");

  const { data: foodItems, isLoading } = useQuery({
    queryKey: ["foodItems", name],
    queryFn: async () => {
      const url = name
        ? `${weburl}/foodItems/searchItems?name=${name}`
        : `${weburl}/foodItems/getFoodItems`;

      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data.data;
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchOnReconnect: true,
    gcTime: 0,
  });

  if (isLoading) {
    return <img className="svg-image" src="/bean-eater.svg" alt="loading" />;
  }

  return (
    <div>
       <link rel="icon" type="image/svg+xml" href="/home.png" />
      <Header
        getOrderItems={getOrderItems}
        openSearch={() => setSearch(true)}
        openProfile={() => setProfile(true)}
      />

      <div className="collectionDiv">
        {foodItems &&
          foodItems.map((foodItem) => {
            return <ProductGrid key={foodItem.id} foodItem={foodItem} />;
          })}
      </div>

      <SubSection />

      {search && <SearchBar closeSearch={() => setSearch(false)} />}
      {profile && <Profile closeProfile={() => setProfile(false)} />}
    </div>
  );
};

export { Home };
