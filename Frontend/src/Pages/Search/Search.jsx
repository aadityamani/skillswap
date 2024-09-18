import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './Search.css';
import axios from "axios";
import ProfileCard from "./ProfileCard.jsx";

const Search = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleInputChange = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== '') {
      const result = await axios(`/user/searchUser?name=${e.target.value}`);
      setSearchResults(result.data.data);
    }
  };

  return (
    <>
      <div className="search-page">
        <div className="search-container">
          <div className={`search-bar ${isActive ? 'active' : ''}`}>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <FiSearch className="search-icon"/>
          </div>
          {searchTerm==='' ?
            <div className="search-box-placeholder">
              Search something...
            </div>
            :
            <>
              {searchResults.length > 0 ?
                (<div className="search-box-results">
                  {searchResults.map((user, index) => (
                    <ProfileCard
                      key={index}
                      profileImageUrl={user?.picture}
                      name={user?.name}
                      rating={user?.rating ? user?.rating : 5}
                      bio={user?.bio}
                      skills={user?.skillsProficientAt}
                      username={user?.username}
                    />
                  ))}
                </div>)
                :
                <div className="search-box-placeholder">
                  No results found...
                </div>
              }
            </>
          }
        </div>
      </div>
    </>
  );
};

export default Search;
