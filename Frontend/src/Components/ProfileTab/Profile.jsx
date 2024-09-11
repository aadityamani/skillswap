import React from 'react';
import { Form, Badge, Spinner } from 'react-bootstrap';

const ProfileTab = ({
  form,
  handleInputChange,
  skillsProficientAt,
  setSkillsProficientAt,
  skillsToLearn,
  setSkillsToLearn,
  skills,
  handleRemoveSkill,
  handleAddSkill,
  handleSaveRegistration,
  handleNext,
  saveLoading
}) => {
  return (
    <div eventKey="registration" title="Registration">
      {/* Name */}
      <div>
        <label className="label">Name</label>
        <br />
        <input
          type="text"
          name="username"
          onChange={handleInputChange}
          className="input-field"
          value={form.name}
          disabled
        />
      </div>
      {/* Email */}
      <div>
        <label className="label mt-3">Email</label>
        <br />
        <input
          type="text"
          name="username"
          onChange={handleInputChange}
          className="input-field"
          value={form.email}
          disabled
        />
      </div>
      {/* Username */}
      <div>
        <label className="label mt-3">Username</label>
        <br />
        <input
          type="text"
          name="username"
          onChange={handleInputChange}
          value={form.username}
          className="input-field"
          placeholder="Enter your username"
        />
      </div>
      {/* Linkedin Profile Link */}
      <div>
        <label className="label mt-3">Linkedin Link</label>
        <br />
        <input
          type="text"
          name="linkedinLink"
          value={form.linkedinLink}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter your Linkedin link"
        />
      </div>
      {/* Github Profile Link */}
      <div>
        <label className="label mt-3">Github Link</label>
        <br />
        <input
          type="text"
          name="githubLink"
          value={form.githubLink}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter your Github link"
        />
      </div>
      {/* Portfolio Link */}
      <div>
        <label className="label mt-3">Portfolio Link</label>
        <br />
        <input
          type="text"
          name="portfolioLink"
          value={form.portfolioLink}
          onChange={handleInputChange}
          className="input-field"
          placeholder="Enter your portfolio link"
        />
      </div>
      {/* Skills Proficient At */}
      <div>
        <label className="label mt-3">Skills Proficient At</label>
        <br />
        <Form.Select
          aria-label="Default select example"
          value={skillsProficientAt}
          onChange={(e) => setSkillsProficientAt(e.target.value)}
          className="form-select"
        >
          <option>Select some skill</option>
          {skills.map((skill, index) => (
            <option key={index} value={skill}>
              {skill}
            </option>
          ))}
        </Form.Select>
        {form.skillsProficientAt.length > 0 && (
          <div>
            {form.skillsProficientAt.map((skill, index) => (
              <Badge
                key={index}
                bg="secondary"
                className="ms-2 mt-2 badge"
                onClick={(event) => handleRemoveSkill(event, "skills_proficient_at")}
              >
                <div className="span d-flex p-1 fs-7 ">{skill} &#10005;</div>
              </Badge>
            ))}
          </div>
        )}
        <button className="btn button button-primary mt-3 ms-1" name="skill_proficient_at" onClick={handleAddSkill}>
          Add Skill
        </button>
      </div>
      {/* Skills to learn */}
      <div>
        <label className="label mt-3">Skills To Learn</label>
        <br />
        <Form.Select
          aria-label="Default select example"
          value={skillsToLearn}
          onChange={(e) => setSkillsToLearn(e.target.value)}
          className="form-select"
        >
          <option>Select some skill</option>
          {skills.map((skill, index) => (
            <option key={index} value={skill}>
              {skill}
            </option>
          ))}
        </Form.Select>
        {form.skillsToLearn.length > 0 && (
          <div>
            {form.skillsToLearn.map((skill, index) => (
              <Badge
                key={index}
                bg="secondary"
                className="ms-2 mt-2 badge"
                onClick={(event) => handleRemoveSkill(event, "skills_to_learn")}
              >
                <div className="span d-flex p-1 fs-7 ">{skill} &#10005;</div>
              </Badge>
            ))}
          </div>
        )}
        <button className="btn button button-primary mt-3 ms-1" name="skill_to_learn" onClick={handleAddSkill}>
          Add Skill
        </button>
      </div>
      <div className="row m-auto d-flex justify-content-center mt-3">
        <button className="btn button button-warning" onClick={handleSaveRegistration} disabled={saveLoading}>
          {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
        </button>
        <button onClick={handleNext} className="btn button button-primary mt-2">
          Next
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
