import { CheerioCrawler, log } from 'crawlee';
import { CATEGORIES, MAX_PAGES, PAGE_PARAM, isValidProduct, enforceCategory, CATEGORY_WEIGHTS } from './config.js';
import type { Product } from './types.js';

export async function runCrawler(): Promise<Product[]> {
  const productsMap = new Map<string, Product>();

  const crawler = new CheerioCrawler({
    minConcurrency: 2,
    maxConcurrency: 10,
    maxRequestRetries: 3,
    requestHandlerTimeoutSecs: 30,
    
    async requestHandler({ $, request, log }) {
      const originalCatSlug = request.userData.catSlug as string;
      const catLabel = request.userData.catLabel as string;
      const currentPage = request.userData.page as number;
      const baseUrl = request.userData.baseUrl as string;

      let foundOnPage = 0;
      let validOnPage = 0;

      $('a[href*="/produto/"]').each((_, el) => {
        const href = $(el).attr("href") || "";
        const m = href.match(/\/produto\/.*?-(\d+)\.html/);
        if (!m) return;
        const id = m[1];
        
        foundOnPage++;

        const title = ($(el).attr("title") || $(el).text() || "").trim().replace(/\s+/g, " ");
        if (!title) return;

        // Apply our filter to exclude useless items
        if (!isValidProduct(title)) {
          return;
        }

        const enforcedCatSlug = enforceCategory(title, originalCatSlug);
        validOnPage++;

        // If product already found, check if new category has higher priority
        if (productsMap.has(id)) {
          const existing = productsMap.get(id)!;
          const existingWeight = CATEGORY_WEIGHTS[existing.category] || 0;
          const newWeight = CATEGORY_WEIGHTS[enforcedCatSlug] || 0;
          
          if (newWeight > existingWeight) {
            existing.category = enforcedCatSlug;
            existing.categoryLabel = catLabel;
          }
          return;
        }

        const card = $(el).closest("div,li,article");
        const priceMatch = card.text().match(/USD\s*([\d.,]+)/);

        let img =
          card.find('img[src*="/produtos/"]').first().attr("src") ||
          $(el).find("img").first().attr("src") ||
          null;
        
        if (img && !img.startsWith("http")) {
          img = `https://www.arsenalsports.com${img}`;
        }

        productsMap.set(id, {
          id,
          name: title,
          url: href.startsWith("http") ? href : `https://www.arsenalsports.com${href}`,
          price: priceMatch ? `USD ${priceMatch[1]}` : null,
          image: img,
          category: enforcedCatSlug,
          categoryLabel: catLabel,
        });
      });

      log.info(`[${originalCatSlug}] page ${currentPage}: found ${foundOnPage} items, ${validOnPage} valid.`);

      // Pagination
      if (foundOnPage > 0 && currentPage < MAX_PAGES) {
        const nextPage = currentPage + 1;
        const sep = baseUrl.includes("?") ? "&" : "?";
        const nextUrl = `${baseUrl}${sep}${PAGE_PARAM}=${nextPage}`;
        
        await crawler.addRequests([{
          url: nextUrl,
          userData: { ...request.userData, page: nextPage }
        }]);
      }
    },
    
    failedRequestHandler({ request, log }) {
      log.error(`Request ${request.url} failed too many times.`);
    }
  });

  // Prepare initial requests (Page 1 of each category)
  const initialRequests = CATEGORIES.map(cat => ({
    url: cat.url,
    userData: {
      catSlug: cat.slug,
      catLabel: cat.label,
      baseUrl: cat.url,
      page: 1
    }
  }));

  log.info(`Starting crawl for ${initialRequests.length} categories...`);
  await crawler.run(initialRequests);
  log.info(`Crawl finished. Extracted ${productsMap.size} unique products.`);

  return [...productsMap.values()];
}
