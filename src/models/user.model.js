import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "UserName is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model("User", userschema);

// Step 1: Collect and Validate Inputs
// 1. Design a signup form to collect the user's name, email, and password.
// 2. Validate the inputs on both frontend and backend:
//    - Email should follow a valid email format.
//    - Password should meet strong criteria (e.g., min length 8, includes uppercase, lowercase, number, special character).
//    - Check that required fields are not empty.

// Step 2: Check if User Already Exists
// 1. Query the database to see if the email exists.
//    Example: `SELECT * FROM users WHERE email = ?`.
// 2. If the email is found:
//    - Respond with: "Email already registered. Please log in."
//    - Stop further execution.

// Step 3: Hash the Password
// 1. Use a library like `bcrypt` to hash the user's password:
//    Example: `const hashedPassword = await bcrypt.hash(password, 10);`.
// 2. Store the hashed password in the database, not the plaintext password.

// Step 4: Generate a Verification Token
// 1. Use a library like `jsonwebtoken` (JWT) or `crypto` to generate a verification token.
//    Example:
//    ```javascript
//    const verificationToken = jwt.sign({ email }, SECRET_KEY, { expiresIn: "15m" });
//    ```
// 2. Save the token in the database with the user record or a separate table.

// Step 5: Save User to Database
// 1. Insert the user details (name, email, hashed password) into the database.
//    Example:
//    ```sql
//    INSERT INTO users (name, email, password, verificationToken) VALUES (?, ?, ?, ?);
//    ```

// Step 6: Send Verification Email
// 1. Use an email service like SendGrid, Nodemailer, or AWS SES to send the email.
//    - Include the verification link: `https://yourapp.com/verify?token=XYZ`.
// 2. In the email body, explain the purpose of the email and provide instructions to complete verification.

// Step 7: Account Verification
// 1. When the user clicks the verification link, handle it on the backend.
//    - Extract the token from the URL.
//    - Validate the token using `jsonwebtoken.verify` or similar.
// 2. If the token is valid:
//    - Activate the user account by updating their record in the database.
//    - Example: `UPDATE users SET isVerified = true WHERE email = ?`.
// 3. If the token is expired or invalid:
//    - Prompt the user to request a new verification email.

// Step 8: Generate Access and Refresh Tokens (After Verification)
// 1. Generate an **Access Token** (short-lived, e.g., 15 minutes):
//    ```javascript
//    const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "15m" });
//    ```
// 2. Generate a **Refresh Token** (long-lived, e.g., 7 days):
//    ```javascript
//    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
//    ```
// 3. Store the refresh token securely in the database or a separate token table.

// Step 9: Secure Token Storage
// 1. Send the access token in an HTTP-only cookie or in the response body (avoid exposing it in JS-accessible storage).
// 2. Store the refresh token securely in an HTTP-only cookie or client-side secure storage.

//login

// Step 1: Collect and Validate Inputs
// 1. Design a login form to collect the user's email and password.
// 2. Validate inputs (email format, password non-empty) on both frontend and backend.

// Step 2: Check if User Exists
// 1. Query the database to check if the email is registered.
//    Example: `SELECT * FROM users WHERE email = ?`.
// 2. If no user is found:
//    - Respond with: "Invalid email or password."

// Step 3: Verify Password
// 1. Use `bcrypt.compare` to compare the plaintext password with the hashed password stored in the database.
//    Example:
//    ```javascript
//    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
//    ```
// 2. If the password is incorrect:
//    - Respond with: "Invalid email or password."

// Step 4: Check Account Status
// 1. Verify if the user's account is activated (`isVerified = true`).
// 2. If not verified:
//    - Respond with: "Please verify your email before logging in."

// Step 5: Generate Access and Refresh Tokens
// 1. Generate an **Access Token** (short-lived, e.g., 15 minutes):
//    ```javascript
//    const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "15m" });
//    ```
// 2. Generate a **Refresh Token** (long-lived, e.g., 7 days):
//    ```javascript
//    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET_KEY, { expiresIn: "7d" });
//    ```
// 3. Store the refresh token securely in the database or a separate token table.

// Step 6: Send Tokens to the Client
// 1. Send the access token in an HTTP-only cookie or response body for API authorization.
// 2. Store the refresh token securely (e.g., HTTP-only cookie or client storage).

// Step 7: Implement Token Refresh
// 1. Provide an API endpoint to refresh the access token using the refresh token.
// 2. Validate the refresh token on the server-side.
// 3. If valid, issue a new access token and send it to the client.

// Step 8: Implement Logout
// 1. Provide a logout endpoint to invalidate the refresh token (delete from the database).
// 2. Ensure the access token expires naturally after its short lifespan.

// Step 9: Security Measures
// 1. Use HTTPS to encrypt all communications.
// 2. Regularly rotate secret keys and refresh tokens for better security.
// 3. Implement rate limiting or CAPTCHA to prevent brute force attacks.
