import React from "react";
import "./Card.css";
import { Link } from "react-router-dom";

const RequestCard = ({ picture, bio, name, skills, rating, username }) => {
  console.log(skills);
  return (
    <div className="request-card-container">
      <img className="request-img-container" src={picture} alt="user" />
      <h3>{name}</h3>
      <h6>Rating : {rating}</h6>
      <p>{bio}</p>
      <div className="prof-buttons">
        <Link to={`/profile/${username}`}>
          <button className="primary ghost">View Profile</button>
        </Link>
      </div>
      <div className="request-profskills">
        <h6 className="request-skills-heading">Skills</h6>
        <div className="request-profskill-boxes">
          {skills.map((skill, index) => (
            <div key={index} className="request-profskill-box">
              <span className="skill">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
