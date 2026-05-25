import weburl from "../../config/weblink.js";
import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const ProductGrid = ({ foodItem }) => {
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const [added, setAdded] = useState(false);

  const addquantity = async () => {
    setAdded(true);
    try {
      await axios.post(
        `${weburl}/orders/addQuantity`,
        {
          id: foodItem.id,
          quantity: quantity,
        },
        {
          withCredentials: true,
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["getOrderItems"],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setAdded(false);
      }, 1000);
    }
  };
  return (
    <>
      <div className="homepage-container">
        <div className="image-container">
          <img src={foodItem.image} />
        </div>
        <div>
          <h2> name: {foodItem.name}</h2>
          <p> Price: ${foodItem.price}</p>
          <div className="product-quantity-options">
            <select
              value={quantity}
              onChange={(e) => {
                const newQuantity = Number(e.target.value);
                setQuantity(newQuantity);
              }}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>v<option value="10">10</option>
            </select>
          </div>
          <button onClick={addquantity}>Add to Cart</button>
          {added && <h2 className="added-food">{foodItem.name} added</h2>}
        </div>
      </div>
    </>
  );
};

export { ProductGrid };
