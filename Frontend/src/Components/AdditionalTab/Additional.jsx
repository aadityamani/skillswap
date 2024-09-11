// src/components/AdditionalTab.js
import React from 'react';
import { Form, Badge, Spinner } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const AdditionalTab = ({ form, handleAdditionalChange, setForm, saveLoading, handleSaveAdditional, setTechStack, techStack, skills, handleNext }) => {
  return (
    <div>
      <div>
        <label style={{ color: "var(--cyan)", marginTop: "20px" }}>Bio (Max 500 Character)</label>
        <br />
        <textarea
          name="bio"
          value={form.bio}
          onChange={(e) => handleAdditionalChange(e, 0)}
          style={{
            borderRadius: "5px",
            border: "1px solid var(--cyan)",
            padding: "5px",
            width: "100%",
            marginBottom: "10px",
          }}
          placeholder="Enter your bio"
        ></textarea>
      </div>

      <div>
        <label style={{ color: "var(--cyan)" }}>Projects</label>

        {form.projects.map((project, index) => (
          <div className="border border-dark rounded-1 p-3 m-1" key={project.id}>
            <div className="form-group">
              <label style={{ color: "var(--cyan)" }}>Title</label>
              <br />
              <input
                type="text"
                name="title"
                value={project.title}
                onChange={(e) => handleAdditionalChange(e, index)}
                style={{
                  borderRadius: "5px",
                  border: "1px solid var(--cyan)",
                  padding: "5px",
                  width: "100%",
                }}
                placeholder="Enter your project title"
              />
            </div>

            <div className="form-group">
              <label className="mt-2" style={{ color: "var(--cyan)" }}>
                Tech Stack
              </label>
              <br />
              <Form.Select
                aria-label="Default select example"
                value={techStack[index]}
                onChange={(e) => {
                  setTechStack((prevState) => prevState.map((item, i) => (i === index ? e.target.value : item)));
                }}
              >
                <option>Select some Tech Stack</option>
                {skills.map((skill, skillIndex) => (
                  <option key={skillIndex} value={skill}>
                    {skill}
                  </option>
                ))}
              </Form.Select>
            </div>

            {techStack[index].length > 0 && (
              <div>
                {form.projects[index].techStack.map((skill, i) => (
                  <Badge
                    key={i}
                    bg="secondary"
                    className="ms-2 mt-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setForm((prevState) => ({
                        ...prevState,
                        projects: prevState.projects.map((item, i) =>
                          i === index
                            ? { ...item, techStack: item.techStack.filter((item) => item !== skill) }
                            : item
                        ),
                      }));
                    }}
                  >
                    <div className="span d-flex p-1 fs-7 ">{skill} &#10005;</div>
                  </Badge>
                ))}
              </div>
            )}

            <button
              className="btn btn-primary mt-3 ms-1"
              name="tech_stack"
              onClick={() => {
                if (techStack[index] === "Select some Tech Stack") {
                  toast.error("Select a tech stack to add");
                  return;
                }
                if (form.projects[index].techStack.includes(techStack[index])) {
                  toast.error("Tech Stack already added");
                  return;
                }
                setForm((prevState) => ({
                  ...prevState,
                  projects: prevState.projects.map((item, i) =>
                    i === index ? { ...item, techStack: [...item.techStack, techStack[index]] } : item
                  ),
                }));
              }}
            >
              Add Tech Stack
            </button>

            <div className="row">
              <div className="col-md-6">
                <label className="mt-2" style={{ color: "var(--cyan)" }}>
                  Start Date
                </label>
                <br />
                <input
                  type="date"
                  name="startDate"
                  value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""}
                  onChange={(e) => handleAdditionalChange(e, index)}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid var(--cyan)",
                    padding: "5px",
                    width: "100%",
                  }}
                />
              </div>

              <div className="col-md-6">
                <label className="mt-2" style={{ color: "var(--cyan)" }}>
                  End Date
                </label>
                <br />
                <input
                  type="date"
                  name="endDate"
                  value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""}
                  onChange={(e) => handleAdditionalChange(e, index)}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid var(--cyan)",
                    padding: "5px",
                    width: "100%",
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="mt-2" style={{ color: "var(--cyan)" }}>
                Project Link
              </label>
              <br />
              <input
                type="text"
                name="projectLink"
                value={project.projectLink}
                onChange={(e) => handleAdditionalChange(e, index)}
                style={{
                  borderRadius: "5px",
                  border: "1px solid var(--cyan)",
                  padding: "5px",
                  width: "100%",
                }}
                placeholder="Enter your project link"
              />
            </div>

            <div className="form-group">
              <label className="mt-2" style={{ color: "var(--cyan)" }}>
                Description
              </label>
              <br />
              <input
                type="text"
                name="description"
                value={project.description}
                onChange={(e) => handleAdditionalChange(e, index)}
                style={{
                  borderRadius: "5px",
                  border: "1px solid var(--cyan)",
                  padding: "5px",
                  width: "100%",
                }}
                placeholder="Enter your project description"
              />
            </div>

            <button
              className="btn btn-danger mt-4"
              onClick={() => {
                const updatedProjects = form.projects.filter((_, projIndex) => projIndex !== index);
                setForm((prevState) => ({
                  ...prevState,
                  projects: updatedProjects,
                }));
              }}
            >
              Remove Project
            </button>
          </div>
        ))}
        
        <br></br>
        <button
          className="btn button-primary mt-2"
          onClick={() => {
            setTechStack((prevState) => [...prevState, "Select some Tech Stack"]);
            setForm((prevState) => ({
              ...prevState,
              projects: [
                ...prevState.projects,
                { id: uuidv4(), title: "", techStack: [], startDate: "", endDate: "", projectLink: "", description: "" },
              ],
            }));
          }}
        >
          Add Project
        </button>
      </div>

      <div className="mt-3">
        <button
          className="button button-warning w-100"
          onClick={handleSaveAdditional}
          disabled={saveLoading}
        >
          {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
        </button>
        <button
          className="button button-primary w-100 mt-2"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdditionalTab;
