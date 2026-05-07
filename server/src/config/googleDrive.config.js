// import { google } from "googleapis";

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

// oauth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
// });

// const drive = google.drive({ version: "v3", auth: oauth2Client });

// const getAuthUrl = () => {
//   return oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: ["https://www.googleapis.com/auth/drive.file"],
//     prompt: "consent",
//   });
// };

// const getTokensFromCode = async (code) => {
//   const { tokens } = await oauth2Client.getToken(code);
//   return tokens;
// };

// export { drive, oauth2Client, getAuthUrl, getTokensFromCode };


import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export { drive };