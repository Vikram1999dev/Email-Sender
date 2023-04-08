const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// These id's and secrets should come from .env file.
//This value is a unique identifier for a Google Cloud project,
//which is used for authentication and authorization purposes.
const CLIENT_ID =
  'xxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com';
//secret key used to authenticate with the Google API.
const CLIENT_SECRET = 'xxxxxxxxxxx-xxxxxxxxxxxxxxxxx_xxxxxxxxxx';
// This value is the URL of the page where the user will be redirected after they authorize the Google API access.
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// This value is a token that can be used to obtain a new access token
// from the Google API without requiring the user to re-authorize the application.
const REFRESH_TOKEN =
  'xxxxx.xxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx_xxxxxxxxxxxxxxxx';
//the above 4 variable help us to authenticate and authorize access to the Google API.

// these lines of code are used to create a new OAuth2 client instance and authenticate
// it using the refresh_token obtained previously. The resulting oAuth2Client object
// can then be used to make authorized requests to the Google API on behalf of the user.
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

app.post('/send-email', async (req, res) => {
  try {
    // this line of code retrieves an access token that allows the
    // oAuth2Client object to make authorized requests to the Google
    // API on behalf of the user.
    const accessToken = await oAuth2Client.getAccessToken();

    //This object is used to send emails using the Gmail service.
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        //type property is set to 'OAuth2', indicating that OAuth2 authentication will be used.
        type: 'OAuth2',
        user: 'xxxxxxxxxxxxxxxxxxxx@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    // This code creates a new object mailOptions, which contains the configuration
    // options for the email that will be sent using the transport object we
    // created earlier.
    const mailOptions = {
      from: 'Vikram Dungarwal <xxxxxxxxxxxxxxxxxxxxxxxxxx.com>',
      to: req.body.email,
      subject: `${req.body.subject}`,
      text: 'Hello from gmail email using API',
      // The html property is set to an HTML-formatted version of the email body
      html: `<p>${req.body.textArea}</p>`,
    };

    // this code sends the email using the transport object with the specified
    // configuration options, and waits for the result of the email sending process.
    const result = await transport.sendMail(mailOptions);
    res.send(result);
    console.log('Email sent...', result);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(3001, () => {
  console.log('Listening at port 3001');
});

// Here are the steps to obtain the `clientId`, `clientSecret`, and `refreshToken` for use with the Gmail API:

// 1. Go to the [Google Developers Console](https://console.developers.google.com/).
// 2. Click on the **Select a project** dropdown in the top right corner and then click on the **New Project** button.
// 3. Enter a project name and click on the **Create** button.
// 4.go to OAuth consent screen
// 5.User type -> Select External
// 6.Add our email id on Test Users
// 7.Then save the consent screen
// 8. In the left navigation panel, click on **Credentials**.
// 9. Click on the **Create credentials** button and select **OAuth client ID**.
// 10. Select **Web application** as the application type and enter a name for your OAuth 2.0 client.
// 11. Under **Authorized redirect URIs**, enter `https://developers.google.com/oauthplayground`.
// 12. Click on the **Create** button to create your OAuth 2.0 client.
// 13. You will now see your `clientId` and `clientSecret`. Make a note of these values as you will need them later.
// 14. Go to the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
// 15. In the top right corner, click on the settings icon and check the box next to **Use your own OAuth credentials**.
// 16. Enter your `clientId` and `clientSecret` in the fields provided.
// 17. paste on the left side https://mail.google.com and then click Authorize APIs
// 18.it will redirect to gmail website.
// 19.click to proceed
// 20. Once you have authorized your app, you will be redirected back to the OAuth 2.0 Playground.
// 21. In the right panel, click on the **Exchange authorization code for tokens** button to obtain an access token and refresh token.
// 22. Make a note of the `refreshToken` as you will need it later.
