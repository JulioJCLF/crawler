export const EXCHANGE_RATE = 5.50;

// Margem padrão de +50%
export const CATEGORY_MARKUPS: Record<string, number> = {
  "replicas": 1.50,
  "pecas-internas": 1.50,
  "pecas-externas": 1.50,
  "vestuario": 1.50,
  "magazines": 1.50,
  "bbs": 1.50,
  "miras": 1.50,
  "default": 1.50
};

export function parseUsdPrice(priceStr: string | null | undefined): number {
  if (!priceStr) return 0;
  const numStr = priceStr.replace(/[^0-9,-]+/g, "").replace(",", ".");
  return parseFloat(numStr) || 0;
}

export function calculateBRLPrice(usdPriceStr: string | null | undefined, category: string): { amount: number, formatted: string } | null {
  const usdAmount = parseUsdPrice(usdPriceStr);
  if (usdAmount <= 0) return null;

  const markup = CATEGORY_MARKUPS[category] || CATEGORY_MARKUPS["default"];
  
  // Fórmula: (USD * Cotação) + Margem (ex: +50% = * 1.50)
  const brlAmount = (usdAmount * EXCHANGE_RATE) * markup;

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(brlAmount);

  return { amount: brlAmount, formatted };
}
