import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Request } from "../models/request.model.js";
import { UnRegisteredUser } from "../models/unRegisteredUser.model.js";
import { generateJWTToken_username } from "../utils/generateJWTToken.js";
import { uploadOnCloudinary } from "../config/connectCloudinary.js";
import { sendMail } from "../utils/SendMail.js";
import { Meeting } from "../models/meeting.model.js";
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { confirmedMeetingBody, scheduleMeetingBody } from "../utils/constants.js";
import {skillCategories} from "../utils/Skills.js";

export const userDetailsWithoutID = asyncHandler(async (req, res) => {
  console.log("\n******** Inside userDetailsWithoutID Controller function ********");

  return res.status(200).json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

export const UserDetails = asyncHandler(async (req, res) => {
  console.log("\n******** Inside UserDetails Controller function ********");
  const username = req.params.username;

  const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const receiverID = user._id;
  const senderID = req.user._id;
  const request = await Request.find({
    $or: [
      { sender: senderID, receiver: receiverID },
      { sender: receiverID, receiver: senderID },
    ],
  });

  // console.log("request", request);

  const status = request.length > 0 ? request[0].status : "Connect";

  // console.log(" userDetail: ", userDetail);
  // console.log("user", user);
  return res
    .status(200)
    .json(new ApiResponse(200, { ...user._doc, status: status }, "User details fetched successfully"));
});

export const UnRegisteredUserDetails = asyncHandler(async (req, res) => {
  console.log("\n******** Inside UnRegisteredUserDetails Controller function ********");

  // console.log(" UnRegisteredUserDetail: ", userDetail);
  return res.status(200).json(new ApiResponse(200, req.user, "User details fetched successfully"));
});

export const saveRegUnRegisteredUser = asyncHandler(async (req, res) => {
  console.log("\n******** Inside saveRegUnRegisteredUser Controller function ********");

  const { name, email, username, linkedinLink, githubLink, portfolioLink, skillsProficientAt, skillsToLearn } =
    req.body;
  // console.log("Body: ", req.body);

  if (!name || !email || !username || skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
    throw new ApiError(400, "Please provide all the details");
  }

  if (!email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
    throw new ApiError(400, "Please provide valid email");
  }

  if (username.length < 3) {
    throw new ApiError(400, "Username should be atleast 3 characters long");
  }

  if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
    throw new ApiError(400, "Please provide atleast one link");
  }

  const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
  const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
  if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
    throw new ApiError(400, "Please provide valid github and linkedin links");
  }

  const existingUser = await User.findOne({ username: username });

  if (existingUser) {
    throw new ApiError(400, "Username already exists");
  }

  const user = await UnRegisteredUser.findOneAndUpdate(
    { email: email },
    {
      name: name,
      username: username,
      linkedinLink: linkedinLink,
      githubLink: githubLink,
      portfolioLink: portfolioLink,
      skillsProficientAt: skillsProficientAt,
      skillsToLearn: skillsToLearn,
    }
  );

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }
  // console.log(" UnRegisteredUserDetail: ", userDetail);
  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveEduUnRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveEduUnRegisteredUser Function *******");

  const { education, email } = req.body;
  if (education.length === 0) {
    throw new ApiError(400, "Education is required");
  }
  education.forEach((edu) => {
    // console.log("Education: ", edu);
    if (!edu.institution || !edu.degree) {
      throw new ApiError(400, "Please provide all the details");
    }
    if (
      !edu.startDate ||
      !edu.endDate ||
      !edu.score ||
      edu.score < 0 ||
      edu.score > 100 ||
      edu.startDate > edu.endDate
    ) {
      throw new ApiError(400, "Please provide valid score and dates");
    }
  });

  const user = await UnRegisteredUser.findOneAndUpdate({ email: email }, { education: education });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveAddUnRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveAddUnRegisteredUser Function *******");

  const { bio, projects, email } = req.body;
  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }
  if (bio.length > 500) {
    throw new ApiError(400, "Bio should be less than 500 characters");
  }

  if (projects.size > 0) {
    projects.forEach((project) => {
      if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
        throw new ApiError(400, "Please provide all the details");
      }
      if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        throw new ApiError(400, "Please provide valid project link");
      }
      if (project.startDate > project.endDate) {
        throw new ApiError(400, "Please provide valid dates");
      }
    });
  }

  const user = await UnRegisteredUser.findOneAndUpdate({ email: email }, { bio: bio, projects: projects });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const registerUser = async (req, res) => {
  console.log("\n******** Inside registerUser function ********");
  // First check if the user is already registered
  // if the user is already registerd than send a message that the user is already registered
  // redirect him to the discover page
  // if the user is not registered than create a new user and redirect him to the discover page after generating the token and setting the cookie and also delete the user detail from unregistered user from the database
  console.log("User:", req.user);

  const {
    name,
    email,
    username,
    linkedinLink,
    githubLink,
    portfolioLink,
    skillsProficientAt,
    skillsToLearn,
    education,
    bio,
    projects,
  } = req.body;

  if (!name || !email || !username || skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
    throw new ApiError(400, "Please provide all the details");
  }
  if (!email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
    throw new ApiError(400, "Please provide valid email");
  }
  if (username.length < 3) {
    throw new ApiError(400, "Username should be atleast 3 characters long");
  }
  if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
    throw new ApiError(400, "Please provide atleast one link");
  }
  const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
  const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
  if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
    throw new ApiError(400, "Please provide valid github and linkedin links");
  }
  if (education.length === 0) {
    throw new ApiError(400, "Education is required");
  }
  education.forEach((edu) => {
    if (!edu.institution || !edu.degree) {
      throw new ApiError(400, "Please provide all the details");
    }
    if (
      !edu.startDate ||
      !edu.endDate ||
      !edu.score ||
      edu.score < 0 ||
      edu.score > 100 ||
      edu.startDate > edu.endDate
    ) {
      throw new ApiError(400, "Please provide valid score and dates");
    }
  });
  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }
  if (bio.length > 500) {
    throw new ApiError(400, "Bio should be less than 500 characters");
  }
  if (projects.size > 0) {
    projects.forEach((project) => {
      if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
        throw new ApiError(400, "Please provide all the details");
      }
      if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        throw new ApiError(400, "Please provide valid project link");
      }
      if (project.startDate > project.endDate) {
        throw new ApiError(400, "Please provide valid dates");
      }
    });
  }

  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new ApiError(400, "User Already registered");
  }

  const checkUsername = await User.findOne({ username: username });
  if (checkUsername) {
    throw new ApiError(400, "Username already exists");
  }

  const user = await UnRegisteredUser.findOneAndDelete({ email: email });
  const newUser = await User.create({
    name: name,
    email: email,
    token: user.token,
    username: username,
    linkedinLink: linkedinLink,
    githubLink: githubLink,
    portfolioLink: portfolioLink,
    skillsProficientAt: skillsProficientAt,
    skillsToLearn: skillsToLearn,
    education: education,
    bio: bio,
    projects: projects,
    picture: req.user.picture,
  });

  if (!newUser) {
    throw new ApiError(500, "Error in saving user details");
  }

  await UnRegisteredUser.findOneAndDelete({ email: email });

  const jwtToken = generateJWTToken_username(newUser);
  const expiryDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
  res.cookie("accessToken", jwtToken, { httpOnly: true, expires: expiryDate, secure: false });
  res.clearCookie("accessTokenRegistration");
  return res.status(200).json(new ApiResponse(200, newUser, "NewUser registered successfully"));
};

export const saveRegRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveRegRegisteredUser Function *******");

  const { name, username, linkedinLink, githubLink, portfolioLink, skillsProficientAt, skillsToLearn, picture } =
    req.body;

  console.log("Body: ", req.body);

  if (!name || !username || skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
    throw new ApiError(400, "Please provide all the details");
  }

  if (username.length < 3) {
    throw new ApiError(400, "Username should be atleast 3 characters long");
  }

  if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
    throw new ApiError(400, "Please provide atleast one link");
  }

  const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
  const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
  if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
    throw new ApiError(400, "Please provide valid github and linkedin links");
  }

  const user = await User.findOneAndUpdate(
    { username: req.user.username },
    {
      name: name,
      username: username,
      linkedinLink: linkedinLink,
      githubLink: githubLink,
      portfolioLink: portfolioLink,
      skillsProficientAt: skillsProficientAt,
      skillsToLearn: skillsToLearn,
      picture: picture,
    }
  );

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveEduRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveEduRegisteredUser Function *******");

  const { education } = req.body;

  if (education.length === 0) {
    throw new ApiError(400, "Education is required");
  }

  education.forEach((edu) => {
    if (!edu.institution || !edu.degree) {
      throw new ApiError(400, "Please provide all the details");
    }
    if (
      !edu.startDate ||
      !edu.endDate ||
      !edu.score ||
      edu.score < 0 ||
      edu.score > 100 ||
      edu.startDate > edu.endDate
    ) {
      throw new ApiError(400, "Please provide valid score and dates");
    }
  });

  const user = await User.findOneAndUpdate({ username: req.user.username }, { education: education });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

export const saveAddRegisteredUser = asyncHandler(async (req, res) => {
  console.log("******** Inside saveAddRegisteredUser Function *******");

  const { bio, projects } = req.body;

  if (!bio) {
    throw new ApiError(400, "Bio is required");
  }

  if (bio.length > 500) {
    throw new ApiError(400, "Bio should be less than 500 characters");
  }

  if (projects.size > 0) {
    projects.forEach((project) => {
      if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
        throw new ApiError(400, "Please provide all the details");
      }
      if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        throw new ApiError(400, "Please provide valid project link");
      }
      if (project.startDate > project.endDate) {
        throw new ApiError(400, "Please provide valid dates");
      }
    });
  }

  const user = await User.findOneAndUpdate({ username: req.user.username }, { bio: bio, projects: projects });

  if (!user) {
    throw new ApiError(500, "Error in saving user details");
  }

  return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
});

// export const updateRegisteredUser = asyncHandler(async (req, res) => {
//   console.log("******** Inside updateRegisteredUser Function *******");

//   const {
//     name,
//     username,
//     linkedinLink,
//     githubLink,
//     portfolioLink,
//     skillsProficientAt,
//     skillsToLearn,
//     education,
//     bio,
//     projects,
//   } = req.body;

//   if (!name || !username || skillsProficientAt.length === 0 || skillsToLearn.length === 0) {
//     throw new ApiError(400, "Please provide all the details");
//   }

//   if (username.length < 3) {
//     throw new ApiError(400, "Username should be atleast 3 characters long");
//   }

//   if (githubLink === "" && linkedinLink === "" && portfolioLink === "") {
//     throw new ApiError(400, "Please provide atleast one link");
//   }

//   const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
//   const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
//   if ((linkedinLink && !linkedinLink.match(linkedinRegex)) || (githubLink && !githubLink.match(githubRegex))) {
//     throw new ApiError(400, "Please provide valid github and linkedin links");
//   }

//   if (education.length === 0) {
//     throw new ApiError(400, "Education is required");
//   }

//   education.forEach((edu) => {
//     if (!edu.institution || !edu.degree) {
//       throw new ApiError(400, "Please provide all the details");
//     }
//     if (
//       !edu.startDate ||
//       !edu.endDate ||
//       !edu.score ||
//       edu.score < 0 ||
//       edu.score > 100 ||
//       edu.startDate > edu.endDate
//     ) {
//       throw new ApiError(400, "Please provide valid score and dates");
//     }
//   });

//   if (!bio) {
//     throw new ApiError(400, "Bio is required");
//   }

//   if (bio.length > 500) {
//     throw new ApiError(400, "Bio should be less than 500 characters");
//   }

//   if (projects.size > 0) {
//     projects.forEach((project) => {
//       if (!project.title || !project.description || !project.projectLink || !project.startDate || !project.endDate) {
//         throw new ApiError(400, "Please provide all the details");
//       }
//       if (project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
//         throw new ApiError(400, "Please provide valid project link");
//       }
//       if (project.startDate > project.endDate) {
//         throw new ApiError(400, "Please provide valid dates");
//       }
//     });
//   }

//   const user = await User.findOneAndUpdate(
//     { username: req.user.username },
//     {
//       name: name,
//       username: username,
//       linkedinLink: linkedinLink,
//       githubLink: githubLink,
//       portfolioLink: portfolioLink,
//       skillsProficientAt: skillsProficientAt,
//       skillsToLearn: skillsToLearn,
//       education: education,
//       bio: bio,
//       projects: projects,
//     }
//   );

//   if (!user) {
//     throw new ApiError(500, "Error in saving user details");
//   }

//   return res.status(200).json(new ApiResponse(200, user, "User details saved successfully"));
// });

export const uploadPic = asyncHandler(async (req, res) => {
  const LocalPath = req.files?.picture[0]?.path;

  if (!LocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const picture = await uploadOnCloudinary(LocalPath);
  if (!picture) {
    throw new ApiError(500, "Error uploading picture");
  }

  res.status(200).json(new ApiResponse(200, { url: picture.url }, "Picture uploaded successfully"));
});

export const discoverUsers = asyncHandler(async (req, res) => {
  console.log("******** Inside discoverUsers Function *******");

  const webDevSkills = [...skillCategories["Frontend Development"], ...skillCategories["Backend Development"], ...skillCategories["Databases"]];
  const machineLearningSkills = skillCategories["Machine Learning"];

  const users = await User.find({ username: { $ne: req.user.username } });

  if (!users) {
    throw new ApiError(500, "Error in fetching users");
  }
  const usersSelected = new Set();
  const usersToLearn = [];
  const webDevUsers = [];
  const mlUsers = [];
  const otherUsers = [];

  // randomly suffle the users array

  users.sort(() => Math.random() - 0.5);

  users.forEach((user) => {
    if (user.skillsProficientAt.some((skill) => req.user.skillsToLearn.includes(skill)) && usersToLearn.length < 5) {
      usersToLearn.push(user);
      usersSelected.add(user);
    }
    if (user.skillsProficientAt.some((skill) => webDevSkills.includes(skill)) && webDevUsers.length < 5) {
      webDevUsers.push(user);
      usersSelected.add(user);
    }
    if (user.skillsProficientAt.some((skill) => machineLearningSkills.includes(skill)) && mlUsers.length < 5) {
      mlUsers.push(user);
      usersSelected.add(user);
    }
    if (!usersSelected.has(user) && otherUsers.length < 5) otherUsers.push(user);
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { forYou: usersToLearn, webDev: webDevUsers, ml: mlUsers, others: otherUsers },
        "Users fetched successfully"
      )
    );
});

export const sendScheduleMeet = asyncHandler(async (req, res) => {
  console.log("******** Inside sendScheduleMeet Function *******");

  const { date, time, username } = req.body;
  if (!date || !time || !username) {
    throw new ApiError(400, "Please provide all the details");
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const to = user.email;
  const startDateTime = new Date(date + " " + time);
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);

  const event = {
    summary: "SkillSwap Session",
    description: "",
    start: { dateTime: startDateTime.toISOString(), timeZone: "Asia/Kolkata" },
    end: { dateTime: endDateTime.toISOString(), timeZone: "Asia/Kolkata" },
    attendees: [
      { email: to },
      { email: req.user.email }
    ],
    conferenceData: {
      createRequest: {
        requestId: new Date().getTime(),
        conferenceSolutionKey: {
          type: "hangoutsMeet"
        }
      }
    }
  };

  const meeting = await Meeting.create({
    fromId: req.user._id,
    toId: user._id,
    summary: event,
    schedule: {date, time}
  })

  await sendMail(to, "Request for Scheduling a meeting", scheduleMeetingBody(user.name, req.user.name, date, time, meeting));

  return res.status(200).json(new ApiResponse(200, null, "Email sent successfully"));
});

export const scheduleMeet = asyncHandler(async (req, res) => {
  console.log("******** Inside scheduleMeet Function *******");

  const meeting = await Meeting.findById(req.query.id);

  const fromUser = await User.findById(meeting.fromId);
  const oAuth2ClientUser = await authenticate(fromUser.token);
  const calendarUser = google.calendar({ version: "v3", auth: oAuth2ClientUser });

  await calendarUser.events.insert({
    calendarId: "primary",
    resource: meeting.summary,
    sendUpdates: "all",
    conferenceDataVersion: 1
  });

  const toUser = await User.findById(meeting.toId);
  const { date, time } = meeting.schedule;
  await sendMail(fromUser.email, "Meeting Scheduled", confirmedMeetingBody(fromUser.name, toUser.name, date, time));

  await Meeting.deleteOne({ _id: meeting._id });

  res.send("Meeting scheduled successfully");
});

async function authenticate(token) {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = "/auth/google/callback";
  const oAuth2Client = new OAuth2Client(clientID, clientSecret, callbackURL);

  try {
    oAuth2Client.setCredentials(token);
  } catch (error) {
    console.log(error)
    return;
    // TODO refresh token if expired
    // await getNewToken(oAuth2Client, tokenPath);
  }
  return oAuth2Client;
}

export const searchUserByName = asyncHandler(async (req, res) => {
  console.log("******** Inside searchUser Function *******");

  const { name, skills } = req.query;
  if (!name && !skills) {
    throw new ApiError(400, "Please provide search parameters");
  }

  let users;
  if(!!name && !!skills) {
    users = await User.find({
      _id: { $ne: req.user._id },  // Excludes the current user
      $and: [
        { name: { $regex: `${name}`, $options: "i" } },  // Matches name (case-insensitive)
        { skillsProficientAt: { $in: skills.split(",") } }  // Matches skills
      ]
    });

  }
  else if(!!name) {
      users = await User.find({ name: { $regex: `${name}`, $options: "i", $ne: req.user.name } });
  }
  else if(!!skills) {
      users = await User.find({ name: { $ne: req.user.name }, skillsProficientAt: { $in: skills.split(",") } });
  }

  if (!users) {
    throw new ApiError(500, "Error in fetching users");
  }

  return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

