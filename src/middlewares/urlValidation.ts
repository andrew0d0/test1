import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

/**
 * Middleware to validate if `req.body.url` is a valid URL.
 */
export function validateUrl(req: Request, res: Response, next: NextFunction) {
  const { url } = req.body;

  if (!url || typeof url !== 'string' || !validator.isURL(url, { require_protocol: true })) {
    const err: any = new Error('URL_VALIDATION_FAILED');
    return next(err);
  }

  next();
}

/**
 * Middleware to sanitize the URL in `req.body.url`.
 * Here we can normalize URL and remove unsafe characters.
 */
export function sanitizeUrl(req: Request, res: Response, next: NextFunction) {
  let url = req.body.url;

  try {
    // Normalize and decode URL safely
    url = decodeURIComponent(url.trim());
    url = validator.escape(url);

    // Reassign sanitized URL
    req.body.url = url;
    next();
  } catch (error) {
    const err: any = new Error('URL_VALIDATION_FAILED');
    next(err);
  }
}
