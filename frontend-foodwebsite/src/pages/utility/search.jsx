import "./search.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ closeSearch }) => {
  const navigate = useNavigate();

  const [input, setInput] = useState("");

  const search = async () => {
    navigate(`/home/?name=${input}`);
    setInput('')
  };
const keyEvent = (e)=>{
if (e.key === "Enter") {
  search()
}
}
  return (
    <div className="search-overlay">
      <div className="search-container">
        <p onClick={closeSearch}>X</p>
        <input
          type="text"
          placeholder="search"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={keyEvent}
        />

        <button onClick={search}>Search</button>
      </div>
    </div>
  );
};
 
export { SearchBar };
