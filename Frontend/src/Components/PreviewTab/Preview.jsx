// src/components/PreviewTab.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

const PreviewTab = ({ form, saveLoading, handleSubmit }) => {
  return (
    <div>
      <h3 style={{ color: "var(--cyan)", marginBottom: "20px" }} className="link w-100 text-center">
        Preview of the Form
      </h3>
      <div className="previewForm" style={{ fontFamily: "var(--secfont)", color: "var(--grey)", marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
          className="link m-sm-0"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Name:</span>
          <span style={{ flex: 2, color: "black" }}>{form.name || "Yet to be filled"}</span>
        </div>
        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
          className="link"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Email ID:</span>
          <span style={{ flex: 2, color: "black" }}>{form.email || "Yet to be filled"}</span>
        </div>
        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
          className="link"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Username:</span>
          <span style={{ flex: 2, color: "black" }}>{form.username || "Yet to be filled"}</span>
        </div>
        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
          className="link"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Portfolio Link:</span>
          <span style={{ flex: 2, color: "black" }}>{form.portfolioLink || "Yet to be filled"}</span>
        </div>
        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
          className="link"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Github Link:</span>
          <span style={{ flex: 2, color: "black" }}>{form.githubLink || "Yet to be filled"}</span>
        </div>
        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
          className="link"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Linkedin Link:</span>
          <span
            style={{
              width: "70vw",
              alignItems: "center",
              flex: 2,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              marginBottom: "1.5rem",
              color: "black"
            }}
          >
            {form.linkedinLink || "Yet to be filled"}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
          className="link"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Skills Proficient At:</span>
          <span style={{ flex: 2, color: "black" }}>{form.skillsProficientAt.join(", ") || "Yet to be filled"}</span>
        </div>
        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
          className="link"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Skills To Learn:</span>
          <span style={{ flex: 2, color: "black" }}>{form.skillsToLearn.join(", ") || "Yet to be filled"}</span>
        </div>

        <div
          style={{
            display: "flex",
            width: "70vw",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
          className="link"
        >
          <span style={{ flex: 1, fontWeight: "bold", color: "var(--cyan)" }}>Bio:</span>
          <span style={{ flex: 2, color: "black" }}>{form.bio || "Yet to be filled"}</span>
        </div>
      </div>
      <div className="row">
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "var(--cyan)",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          className="w-50 d-flex m-auto text-center align-content-center justify-content-center"
        >
          {saveLoading ? <Spinner animation="border" variant="primary" /> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PreviewTab;
