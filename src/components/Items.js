import React, { useState, useEffect } from "react";
import { API_URL } from "./Login";
import axios from "axios";

const CollectionItems = (props) => {
  const [items, setItems] = useState([]);

  const getItems = async () => {
    try {
      const response = await axios.get(`${API_URL}collections/${props.match.params.id}/items`);
      setItems(response.data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          {/* Display other fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default CollectionItems;
