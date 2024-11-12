import React from 'react';
import { Spinner } from 'react-bootstrap';

const EducationTab = ({ form, handleEducationChange, setForm, saveLoading, handleSaveEducation, handleNext }) => {
  return (
    <div>
      {form.education.map((education, index) => (
        <div key={index} className="education-section">
          <div className="form-group">
            <label className="label">Institution</label>
            <input
              type="text"
              name="institution"
              value={education.institution}
              onChange={(e) => handleEducationChange(e, index)}
              className="input-field"
              placeholder="Enter your institution name"
            />
          </div>
          <div className="form-group">
            <label className="label mt-3">Degree</label>
            <input
              type="text"
              name="degree"
              value={education.degree}
              onChange={(e) => handleEducationChange(e, index)}
              className="input-field"
              placeholder="Enter your degree"
            />
          </div>
          <div className="form-group">
            <label className="label mt-3">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={education.startDate}
              onChange={(e) => handleEducationChange(e, index)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="label mt-3">End Date</label>
            <input
              type="date"
              name="endDate"
              value={education.endDate}
              onChange={(e) => handleEducationChange(e, index)}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label className="label mt-3">Score</label>
            <input
              type="text"
              name="score"
              value={education.score}
              onChange={(e) => handleEducationChange(e, index)}
              className="input-field"
              placeholder="Enter your score or percentage"
            />
          </div>
          <div className="form-group">
            <label className="label mt-3">Description</label>
            <input
              type="text"
              name="description"
              value={education.description}
              onChange={(e) => handleEducationChange(e, index)}
              className="input-field"
              placeholder="Enter your description or achievements"
            />
          </div>
          <button
            className="btn btn-danger mt-4"
            onClick={() => {
              const updatedEducation = form.education.filter((_, eduIndex) => eduIndex !== index);
              setForm((prevState) => ({
                ...prevState,
                education: updatedEducation,
              }));
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        className="btn button-primary mt-2"
        onClick={() => {
          setForm((prevState) => ({
            ...prevState,
            education: [
              ...prevState.education,
              { institution: "", degree: "", startDate: "", endDate: "", score: "", description: "" },
            ],
          }));
        }}
      >
        Add Education
      </button>
      <div className="row m-auto d-flex justify-content-center mt-3">
        <button
          className="btn button button-warning"
          onClick={handleSaveEducation}
          disabled={saveLoading}
        >
          {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
        </button>
        <button
          className="btn button button-primary mt-2"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EducationTab;
