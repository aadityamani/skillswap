import React, { useState, useEffect } from "react";

const LandingPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "var(--grey)",
  };

  const titleContainerStyle = {
    display: "flex",
    backgroundColor: "var(--grey)",
    padding: "20px",
    margin: "100px",
    marginTop: "300px",
    justifyContent: "center",
    alignItems: "center",
    border: "10px solid var(--cyan)",
  };

  const titleStyle = {
    fontFamily: "Josefin Sans, sans-serif",
    color: "var(--cyan)",
    fontWeight: 700,
    fontSize: "5.5rem",
    textAlign: "center",
  };

  const contentTitleStyle = {
    textAlign: "center",
    color: "var(--grey)",
    fontFamily: "var(--basefont)",
    backgroundColor: "var(--cyan)",
    width: "100%",
    fontSize: "4rem",
    fontWeight: 700,
    marginTop: "300px",
  };

  const descriptionStyle = {
    fontFamily: "var(--secfont)",
    fontSize: "1.2rem",
    textAlign: "center",
    color: "white",
    maxWidth: "1000px",
    margin: "60px",
  };

  const buttonStyle = {
    backgroundColor: "var(--cyan)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const imageStyle = {
    position: "absolute",
    left: `${scrollPosition}px`,
    width: "400px",
    justifyContent: "center",
  };

  const imageBelowStyle = {
    position: "absolute",
    right: `${scrollPosition}px`,
    width: "400px",
    justifyContent: "center",
  };

  const textContainer = {
    textAlign: "center",
    alignItems: "center",
    marginBottom: "40px",
  };

  const handleButtonClick = () => {
    // Handle button click event
    console.log("Button clicked!");
  };

  return (
    <div style={containerStyle}>
      <div style={containerStyle}>
        <div>
          <img src={"/assets/images/1.png"} alt="Above Image" style={imageStyle} />
          <div style={titleContainerStyle}>
            <h1 style={titleStyle}>SKILL SWAP</h1>
          </div>
          <img src={"/assets/images/2.png"} alt="Below Image" style={imageBelowStyle} />
        </div>
      </div>
      <h2 style={contentTitleStyle}>WHY SKILL SWAP?</h2>
      <div id="why-skill-swap" style={textContainer}>
        <div style={descriptionStyle}>
          At Skill Swap, we believe in the power of mutual learning and collaboration. Here's why Skill Swap is the
          ultimate platform for skill acquisition and knowledge exchange:
          <br />
          <br />
          <br />
          <h4 style={{ color: "var(--teal)" }}>➊ Learn From Experts:</h4> Gain insights and practical knowledge directly
          from experienced mentors who excel in their respective fields. Whether it's mastering a new programming
          language, honing your culinary skills, or delving into the world of digital marketing, our mentors are here to
          guide you every step of the way.
          <br />
          <br />
          <h4 style={{ color: "var(--teal)" }}>➋ Share Your Expertise:</h4> Have a skill or passion you're eager to share?
          Skill Swap provides a platform for you to become a mentor yourself. Share your expertise with others, foster a
          sense of community, and contribute to the growth of aspiring learners.
          <br />
          <br />
          <h4 style={{ color: "var(--teal)" }}>➌ Collaborative Environment:</h4> Our community thrives on collaboration.
          Connect with like-minded individuals, participate in group projects, and engage in discussions that fuel
          creativity and innovation. Skill Swap isn't just about individual growth—it's about collective advancement.
          <br />
          <br />
          <h4 style={{ color: "var(--teal)" }}>➍ Diverse Learning Opportunities:</h4> With Skill Swap, the possibilities are
          endless and <b>free of cost</b>. Explore a wide range of topics and disciplines, from traditional crafts to
          cutting-edge technologies. Our diverse library of skills ensures there's something for everyone, regardless of
          your interests or background.
          <br />
          <br />
          <h4 style={{ color: "var(--teal)" }}>➎ Continuous Growth:</h4> Learning is a lifelong journey, and Skill Swap is
          here to support you every step of the way. Whether you're a novice or a seasoned professional, our platform
          empowers you to continuously expand your knowledge, challenge yourself, and embrace new opportunities.
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
