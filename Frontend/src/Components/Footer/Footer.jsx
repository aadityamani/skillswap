import React from "react";
import { Container, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <Navbar variant="dark" style={{ backgroundColor: "var(--cyan" }}>
        <Container className="mx-auto w-100 d-flex justify-content-center">
          <div className="text-center" style={{ fontFamily: "var(--secfont)", color: "white" }}>
            Copyright &copy; 2024 SkillSwap. All rights reserved.
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Footer;
