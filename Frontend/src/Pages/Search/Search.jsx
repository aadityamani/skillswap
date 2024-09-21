import React, {useEffect, useState} from 'react';
import { FiSearch } from 'react-icons/fi';
import { Form, Badge } from 'react-bootstrap';
import './Search.css';
import axios from "axios";
import ProfileCard from "../../Components/ProfileCard/ProfileCard.jsx";
import {toast} from "react-toastify";
import {skills} from "../../util/Skills.js";

const Search = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [skill, setSkill] = useState('Search by Skill');
  const [skillSearch, setSkillSearch] = useState([]);

  useEffect(() => {
    const search = async () => {
      const result = await axios(`/user/searchUser?name=${searchTerm}&skills=${skillSearch.join(",")}`);
      setSearchResults(result.data.data);
    }
    search();
  }, [skillSearch]);

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleInputChange = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value !== '' || skillSearch.length > 0) {
      const result = await axios(`/user/searchUser?name=${e.target.value}&skills=${skillSearch.join(",")}`);
      setSearchResults(result.data.data);
    }
  };

  const handleAddSkill = async () => {
    if (skill === "Search by Skill") {
      toast.error("Select a skill to add");
      return;
    }
    if (skillSearch.includes(skill)) {
      toast.error("Skill already added");
      return;
    }
    setSkillSearch(prev => [...prev, skill]);
  };

  const handleRemoveSkill = async (e) => {
    const skill = e.target.innerText.split(" ")[0];
    setSkillSearch(prev => prev.filter((item) => item !== skill));
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
          <div className="search-skill-container">
            <div className="search-skill-box">
              <Form.Select
                aria-label="Default select example"
                value={skill}
                aria-placeholder="Search by Skill"
                onChange={(e) => setSkill(e.target.value)}
                className="search-form-select"
              >
                <option>Search by Skill</option>
                {skills.map((skill, index) => (
                  <option key={index} value={skill}>
                    {skill}
                  </option>
                ))}
              </Form.Select>
              <button className="btn button-primary" onClick={handleAddSkill}>
                Add
              </button>
            </div>
            {skillSearch.length > 0 && (
              <div>
                {skillSearch.map((skill, index) => (
                  <Badge
                    key={index}
                    bg="secondary"
                    className="ms-2 mt-2 badge"
                    onClick={(event) => handleRemoveSkill(event)}
                  >
                    <div className="span d-flex p-1 fs-7 ">{skill} &#10005;</div>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {(searchTerm==='' && skillSearch.length===0) ?
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
