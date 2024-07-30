export const scheduleMeetingBody = (toName, fromName, date, time, meeting) =>`
Dear ${toName},

I hope this message finds you well.

You have received a request for an online mentoring session through SkillSwap. Below are the details for the proposed session:

From: ${fromName}
Date: ${date}  
Time: ${time}

To confirm your availability and schedule the session, please click on the following link:

http://localhost:8000/user/scheduleMeet?id=${meeting._id}

Once you confirm, both you and the requester will receive an email with the finalized details and a Google Meet link for the session.

Thank you for your time and support in mentoring through SkillSwap!

Best regards,

The SkillSwap Team
`;

export const confirmedMeetingBody = (toName, fromName, date, time) =>`
Dear ${toName},

Your request for an online mentoring session through SkillSwap has been accepted by ${fromName}. Below are the details for the session:

Mentor: ${fromName}
Date: ${date}  
Time: ${time}

The event has been added to your calendar. Refer that for more details.

Thank you for your time and support in mentoring through SkillSwap!

Best regards,

The SkillSwap Team
`;