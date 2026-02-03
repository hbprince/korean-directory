#!/usr/bin/env tsx
/**
 * SEO Indexing Audit Script
 *
 * Reads sitemap.xml, samples URLs, and checks each for:
 * - HTTP status code (200 / 3xx / 4xx / 5xx)
 * - X-Robots-Tag response header
 * - <meta name="robots"> content in HTML
 * - <link rel="canonical"> href
 * - Final URL after redirect follows
 *
 * Usage:
 *   npx tsx scripts/seo/audit-indexing.ts --base=https://www.haninmap.com --sample=200 --pathsFromSitemap=true
 */

// ─── Arg parsing ────────────────────────────────────────────────────

function parseArgs(): { base: string; sample: number; pathsFromSitemap: boolean } {
  const args = process.argv.slice(2);
  let base = 'https://www.haninmap.com';
  let sample = 200;
  let pathsFromSitemap = true;

  for (const arg of args) {
    if (arg.startsWith('--base=')) base = arg.split('=')[1];
    else if (arg.startsWith('--sample=')) sample = parseInt(arg.split('=')[1], 10);
    else if (arg.startsWith('--pathsFromSitemap=')) pathsFromSitemap = arg.split('=')[1] === 'true';
  }

  // Trim trailing slash
  base = base.replace(/\/$/, '');

  return { base, sample, pathsFromSitemap };
}

// ─── Types ──────────────────────────────────────────────────────────

interface AuditResult {
  url: string;
  finalUrl: string;
  statusCode: number;
  redirected: boolean;
  redirectChain: string[];
  xRobotsTag: string | null;
  metaRobots: string | null;
  canonical: string | null;
  canonicalMismatch: boolean;
  issues: string[];
}

interface AuditSummary {
  totalChecked: number;
  ok200: number;
  noindexCount: number;
  fivexxCount: number;
  redirectCount: number;
  canonicalMismatchCount: number;
  noindexUrls: string[];
  fivexxUrls: string[];
  redirectUrls: string[];
  canonicalMismatchUrls: string[];
}

// ─── Fetch sitemap URLs ─────────────────────────────────────────────

async function fetchSitemapUrls(base: string): Promise<string[]> {
  const sitemapUrl = `${base}/sitemap.xml`;
  console.log(`Fetching sitemap: ${sitemapUrl}`);

  const res = await fetch(sitemapUrl, { redirect: 'follow' });
  if (!res.ok) {
    console.error(`Failed to fetch sitemap: ${res.status}`);
    return [];
  }

  const xml = await res.text();

  // Simple regex extraction of <loc> elements
  const urls: string[] = [];
  const locRegex = /<loc>\s*(.*?)\s*<\/loc>/g;
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  console.log(`Found ${urls.length} URLs in sitemap`);
  return urls;
}

// ─── Sample URLs ────────────────────────────────────────────────────

function sampleUrls(urls: string[], count: number): string[] {
  if (urls.length <= count) return [...urls];

  // Stratified sampling: pick from start, middle, end
  const result = new Set<string>();

  // Always include homepage and first few
  for (let i = 0; i < Math.min(5, urls.length); i++) {
    result.add(urls[i]);
  }

  // Random sample for the rest
  const shuffled = [...urls].sort(() => Math.random() - 0.5);
  for (const url of shuffled) {
    if (result.size >= count) break;
    result.add(url);
  }

  return Array.from(result);
}

// ─── Audit a single URL ────────────────────────────────────────────

async function auditUrl(url: string): Promise<AuditResult> {
  const result: AuditResult = {
    url,
    finalUrl: url,
    statusCode: 0,
    redirected: false,
    redirectChain: [],
    xRobotsTag: null,
    metaRobots: null,
    canonical: null,
    canonicalMismatch: false,
    issues: [],
  };

  try {
    // Follow redirects manually to track chain
    let currentUrl = url;
    const visited = new Set<string>();
    let response: Response | null = null;

    for (let hop = 0; hop < 10; hop++) {
      if (visited.has(currentUrl)) {
        result.issues.push('redirect loop detected');
        break;
      }
      visited.add(currentUrl);

      response = await fetch(currentUrl, {
        redirect: 'manual',
        headers: {
          'User-Agent': 'HaninMap-SEO-Audit/1.0',
          'Accept': 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(15000),
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        if (!location) {
          result.issues.push(`${response.status} redirect without Location header`);
          break;
        }
        const nextUrl = location.startsWith('http')
          ? location
          : new URL(location, currentUrl).toString();
        result.redirectChain.push(`${response.status} -> ${nextUrl}`);
        currentUrl = nextUrl;
        continue;
      }

      break;
    }

    if (!response) {
      result.issues.push('no response received');
      return result;
    }

    result.statusCode = response.status;
    result.finalUrl = currentUrl;
    result.redirected = result.redirectChain.length > 0;

    // Check X-Robots-Tag header
    const xRobots = response.headers.get('x-robots-tag');
    if (xRobots) {
      result.xRobotsTag = xRobots;
      if (xRobots.toLowerCase().includes('noindex')) {
        result.issues.push(`X-Robots-Tag contains noindex: ${xRobots}`);
      }
    }

    // Parse HTML for meta robots and canonical
    if (response.status === 200) {
      const html = await response.text();

      // meta robots
      const metaRobotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i)
        || html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']robots["']/i);
      if (metaRobotsMatch) {
        result.metaRobots = metaRobotsMatch[1];
        if (metaRobotsMatch[1].toLowerCase().includes('noindex')) {
          result.issues.push(`meta robots contains noindex: ${metaRobotsMatch[1]}`);
        }
      }

      // canonical
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)
        || html.match(/<link\s+href=["']([^"']+)["']\s+rel=["']canonical["']/i);
      if (canonicalMatch) {
        result.canonical = canonicalMatch[1];
        // Check if canonical matches the final URL
        if (canonicalMatch[1] !== currentUrl && canonicalMatch[1] !== url) {
          result.canonicalMismatch = true;
          result.issues.push(`canonical mismatch: page=${currentUrl}, canonical=${canonicalMatch[1]}`);
        }
      }
    }

    // Flag 5xx
    if (result.statusCode >= 500) {
      result.issues.push(`server error: ${result.statusCode}`);
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    result.issues.push(`fetch error: ${message}`);
    result.statusCode = 0;
  }

  return result;
}

// ─── Summarize results ──────────────────────────────────────────────

function summarize(results: AuditResult[]): AuditSummary {
  const summary: AuditSummary = {
    totalChecked: results.length,
    ok200: 0,
    noindexCount: 0,
    fivexxCount: 0,
    redirectCount: 0,
    canonicalMismatchCount: 0,
    noindexUrls: [],
    fivexxUrls: [],
    redirectUrls: [],
    canonicalMismatchUrls: [],
  };

  for (const r of results) {
    if (r.statusCode === 200 && r.issues.length === 0) summary.ok200++;

    const hasNoindex = r.issues.some(i => i.includes('noindex'));
    if (hasNoindex) {
      summary.noindexCount++;
      summary.noindexUrls.push(r.url);
    }

    if (r.statusCode >= 500) {
      summary.fivexxCount++;
      summary.fivexxUrls.push(r.url);
    }

    if (r.redirected) {
      summary.redirectCount++;
      summary.redirectUrls.push(r.url);
    }

    if (r.canonicalMismatch) {
      summary.canonicalMismatchCount++;
      summary.canonicalMismatchUrls.push(r.url);
    }
  }

  return summary;
}

// ─── Output ─────────────────────────────────────────────────────────

function generateMarkdown(summary: AuditSummary, results: AuditResult[]): string {
  const date = new Date().toISOString().split('T')[0];
  let md = `# SEO Indexing Audit — ${date}\n\n`;

  md += `## Summary\n\n`;
  md += `| Metric | Count |\n`;
  md += `|--------|-------|\n`;
  md += `| Total checked | ${summary.totalChecked} |\n`;
  md += `| 200 OK (clean) | ${summary.ok200} |\n`;
  md += `| noindex found | ${summary.noindexCount} |\n`;
  md += `| 5xx errors | ${summary.fivexxCount} |\n`;
  md += `| Redirects | ${summary.redirectCount} |\n`;
  md += `| Canonical mismatch | ${summary.canonicalMismatchCount} |\n\n`;

  if (summary.noindexUrls.length > 0) {
    md += `## noindex URLs\n\n`;
    for (const u of summary.noindexUrls) md += `- ${u}\n`;
    md += `\n`;
  }

  if (summary.fivexxUrls.length > 0) {
    md += `## 5xx URLs\n\n`;
    for (const u of summary.fivexxUrls) md += `- ${u}\n`;
    md += `\n`;
  }

  if (summary.redirectUrls.length > 0) {
    md += `## Redirect URLs\n\n`;
    for (const u of summary.redirectUrls) md += `- ${u}\n`;
    md += `\n`;
  }

  if (summary.canonicalMismatchUrls.length > 0) {
    md += `## Canonical Mismatch URLs\n\n`;
    for (const u of summary.canonicalMismatchUrls) md += `- ${u}\n`;
    md += `\n`;
  }

  // Detailed issues
  const withIssues = results.filter(r => r.issues.length > 0);
  if (withIssues.length > 0) {
    md += `## Detailed Issues\n\n`;
    for (const r of withIssues) {
      md += `### ${r.url}\n`;
      md += `- Status: ${r.statusCode}\n`;
      md += `- Final URL: ${r.finalUrl}\n`;
      if (r.xRobotsTag) md += `- X-Robots-Tag: ${r.xRobotsTag}\n`;
      if (r.metaRobots) md += `- Meta Robots: ${r.metaRobots}\n`;
      if (r.canonical) md += `- Canonical: ${r.canonical}\n`;
      for (const issue of r.issues) md += `- **Issue**: ${issue}\n`;
      md += `\n`;
    }
  }

  return md;
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  const { base, sample, pathsFromSitemap } = parseArgs();

  console.log(`\nSEO Indexing Audit`);
  console.log(`  Base URL:  ${base}`);
  console.log(`  Sample:    ${sample}`);
  console.log(`  Source:    ${pathsFromSitemap ? 'sitemap.xml' : 'manual'}\n`);

  // Get URLs
  let urls: string[] = [];
  if (pathsFromSitemap) {
    urls = await fetchSitemapUrls(base);
  }

  if (urls.length === 0) {
    console.error('No URLs found. Exiting.');
    process.exit(1);
  }

  // Sample
  const sampled = sampleUrls(urls, sample);
  console.log(`Auditing ${sampled.length} URLs...\n`);

  // Audit with concurrency control
  const CONCURRENCY = 10;
  const results: AuditResult[] = [];
  let completed = 0;

  for (let i = 0; i < sampled.length; i += CONCURRENCY) {
    const batch = sampled.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(url => auditUrl(url)));
    results.push(...batchResults);
    completed += batch.length;

    // Progress
    const pct = Math.round((completed / sampled.length) * 100);
    process.stdout.write(`\r  Progress: ${completed}/${sampled.length} (${pct}%)`);
  }
  console.log('\n');

  // Summarize
  const summary = summarize(results);

  console.log('─── Results ───');
  console.log(`  200 OK (clean): ${summary.ok200}`);
  console.log(`  noindex:        ${summary.noindexCount}`);
  console.log(`  5xx errors:     ${summary.fivexxCount}`);
  console.log(`  Redirects:      ${summary.redirectCount}`);
  console.log(`  Canonical err:  ${summary.canonicalMismatchCount}`);
  console.log('');

  // Write reports
  const fs = await import('fs');
  const path = await import('path');

  const date = new Date().toISOString().split('T')[0];
  const reportsDir = path.join(process.cwd(), 'reports');
  fs.mkdirSync(reportsDir, { recursive: true });

  const mdPath = path.join(reportsDir, `indexing-audit-${date}.md`);
  const jsonPath = path.join(reportsDir, `indexing-audit-${date}.json`);

  const markdown = generateMarkdown(summary, results);
  fs.writeFileSync(mdPath, markdown, 'utf-8');
  fs.writeFileSync(jsonPath, JSON.stringify({ summary, results }, null, 2), 'utf-8');

  console.log(`Reports written:`);
  console.log(`  ${mdPath}`);
  console.log(`  ${jsonPath}`);

  // Exit with error code if critical issues found
  if (summary.noindexCount > 0 || summary.fivexxCount > 0) {
    console.log(`\n⚠ ISSUES FOUND — review the reports above.`);
    process.exit(1);
  }

  console.log(`\nAll checks passed.`);
}

main().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
