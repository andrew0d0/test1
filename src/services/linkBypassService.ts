import puppeteer, { Browser, Page } from 'puppeteer';

interface Metadata {
  title?: string;
  description?: string;
}

interface BypassResult {
  finalUrl: string;
  metadata?: Metadata;
  warnings?: string[];
}

/**
 * Detect if the page is likely behind a CAPTCHA or similar.
 */
async function detectCaptcha(page: Page): Promise<boolean> {
  // This is a heuristic example
  const captchaSelectors = [
    'iframe[src*="captcha"]',
    'input[name="captcha"]',
    '#recaptcha', 
    '.g-recaptcha',
    '[aria-label*="captcha"]',
    'div[class*="captcha"]'
  ];

  for (const selector of captchaSelectors) {
    const found = await page.$(selector);
    if (found) return true;
  }
  return false;
}

/**
 * Attempt to extract final URL from page content heuristically,
 * e.g. via regex on scripts or anchor tags.
 */
async function heuristicExtractFinalUrl(page: Page): Promise<string | null> {
  // Try some common patterns:
  // 1. Look for anchor tags with clear URLs
  const anchors = await page.$$eval('a[href]', (els) => els.map(a => a.href));

  // Filter anchors that look like external URLs (heuristic: contain http(s))
  for (const href of anchors) {
    if (href && /^https?:\/\//.test(href)) {
      if (!href.includes('adlink-type-domain.com')) { // Replace or expand blocked domains here
        return href;
      }
    }
  }

  // 2. Search scripts or inline JS for URL patterns - example:
  const content = await page.content();

  const urlRegex = /(https?:\/\/[^\s"']{5,})/g;
  const matches = Array.from(content.matchAll(urlRegex)).map(m => m[1]);

  for (const candidate of matches) {
    if (!candidate.includes('adlink-type-domain.com')) {
      return candidate;
    }
  }

  return null;
}

/**
 * Main function to bypass ad link using Puppeteer headless browser.
 * Handles redirects, JS-based navigations, and extracts final destination.
 */
export async function bypassAdLink(adUrl: string): Promise<BypassResult> {
  let browser: Browser | null = null;
  const warnings: string[] = [];

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Set user agent to resemble a real browser to avoid detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/114.0.0.0 Safari/537.36'
    );

    // Set reasonable timeout
    await page.setDefaultNavigationTimeout(30000);

    // Intercept requests to detect rate limiting or blocked resources
    page.on('response', async (response) => {
      const status = response.status();

      if (status === 429) {
        warnings.push('Rate limit detected from target site.');
      }

      if (status >= 400 && status < 500 && status !== 404) {
        warnings.push(`Client error detected: HTTP ${status}`);
      }
    });

    // Navigate to the ad link URL, wait for network idle to allow JS redirects
    await page.goto(adUrl, { waitUntil: 'networkidle2' });

    if (await detectCaptcha(page)) {
      const err: any = new Error('CAPTCHA_DETECTED');
      throw err;
    }

    // After navigation and redirection, get the current page URL
    let finalUrl = page.url();

    // If the final page still looks like an ad/link shortener, attempt heuristic extraction
    // Here you might add your own lists/domains to match
    if (
      finalUrl === adUrl || 
      finalUrl.includes('adf.ly') ||
      finalUrl.includes('bit.ly') || 
      finalUrl.includes('shorturl') || 
      finalUrl.includes('ads')
    ) {
      const extractedUrl = await heuristicExtractFinalUrl(page);
      if (extractedUrl) {
        finalUrl = extractedUrl;
      } else {
        warnings.push('Could not heuristically extract final URL, returning current page URL.');
      }
    }

    // Extract metadata (optional)
    const metadata = await page.evaluate(() => {
      return {
        title: document.title || undefined,
        description:
          document
            .querySelector('meta[name="description"]')
            ?.getAttribute('content') || undefined,
      };
    });

    return { finalUrl, metadata, warnings };
  } catch (err) {
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
