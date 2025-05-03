import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserModel } from '../db/models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'default_refresh_secret';

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login or register a user
 *     description: Logs in an existing user or registers a new one if username doesn't exist. Returns JWT token and user.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful login or registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *       400:
 *         description: Missing credentials
 *       500:
 *         description: Server error
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;

    if (!username || !password) {
      throw new Error('Username and password required');
    }

    let user = await UserModel.findOne({ username });

    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user._id, username: user.username },
      REFRESH_SECRET,
      { expiresIn: '1h' }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: { _id: user._id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh the access token using a valid refresh token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The refresh token provided during login.
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Successfully refreshed the access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       403:
 *         description: Invalid or expired refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the token is invalid or expired.
 *                   example: "Invalid or expired refresh token"
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;

    const user = await UserModel.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      throw new Error('Refresh token invalid or revoked');
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logs out a user by invalidating their refresh token.
 *     description: Logs out a user by setting their refresh token to null in the database.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to log out.
 *                 example: "64f8c0e5b9d1e2a3c4d5e6f7"
 *     responses:
 *       200:
 *         description: Successfully logged out the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out"
 *       400:
 *         description: Bad request, possibly due to missing or invalid userId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid userId"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
export const logoutUser = async (req: Request, res: Response) => {
  const { userId } = req.body;
  await UserModel.findByIdAndUpdate(userId, { refreshToken: null });
  res.json({ message: 'Logged out' });
};

/**
 * @swagger
 * /api/users/create-user:
 *   post:
 *     summary: Create a new user
 *     description: Registers a new user with a username and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *       400:
 *         description: Missing or invalid input
 *       500:
 *         description: Server error
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password }: { username: string; password: string } =
      req.body;

    if (!username || !password) {
      throw new Error('Username and password required');
    }

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, passwordHash });
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
