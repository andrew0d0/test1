import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validateUrl, sanitizeUrl } from './middlewares/urlValidation';
import { bypassAdLink } from './services/linkBypassService';
import 'express-async-errors'; // allows throwing async errors to error middleware

const app = express();

// Basic security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting middleware to mitigate abuse
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // max 30 requests per IP per minute
  message: { error: 'Too many requests, please slow down.' }
});
app.use(limiter);

// API contract interfaces
interface BypassRequestBody {
  url: string; // The ad link to bypass
}

interface BypassResponse {
  originalUrl: string;
  finalUrl: string;
  metadata?: {
    title?: string;
    description?: string;
  };
  warnings?: string[];
}

// POST endpoint to receive ad link and bypass
/**
 * @openapi
 * /api/bypass:
 *   post:
 *     summary: Bypass an ad link to find the final destination URL.
 *     requestBody:
 *       description: JSON with ad link URL.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "http://example-adlink.com/redirect?target=abcd"
 *     responses:
 *       200:
 *         description: Successfully found final URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 originalUrl:
 *                   type: string
 *                 finalUrl:
 *                   type: string
 *                 metadata:
 *                   type: object
 *                   nullable: true
 *                 warnings:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid URL or bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post(
  '/api/bypass',
  validateUrl,
  sanitizeUrl,
  async (req: Request<{}, {}, BypassRequestBody>, res: Response<BypassResponse | { error: string }>, next: NextFunction) => {
    const { url } = req.body;

    try {
      const { finalUrl, metadata, warnings } = await bypassAdLink(url);

      res.json({
        originalUrl: url,
        finalUrl,
        metadata,
        warnings,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error handler:', err);

  if (err.isAxiosError || err.name === 'FetchError') {
    // Network or fetch errors
    return res.status(502).json({ error: 'Failed to fetch the provided link.' });
  }

  if (err.message === 'URL_VALIDATION_FAILED') {
    return res.status(400).json({ error: 'Invalid URL provided.' });
  }

  if (err.message === 'CAPTCHA_DETECTED') {
    return res.status(429).json({ error: 'Captcha detected. Cannot bypass link.' });
  }

  if (err.message === 'RATE_LIMITED') {
    return res.status(429).json({ error: 'Rate limited by target site.' });
  }

  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
