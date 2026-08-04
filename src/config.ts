export const CATEGORIES = [
  { slug: "replicas",       label: "Réplicas",                url: "https://www.arsenalsports.com/produtos/airsoft-replicas-de-airsoft/filter?d=124" },
  { slug: "pecas-externas", label: "Peças Externas",          url: "https://www.arsenalsports.com/produtos/airsoft-pecas-externas-para-replicas-de-airsoft/filter?d=191" },
  { slug: "pecas-internas", label: "Peças Internas",          url: "https://www.arsenalsports.com/produtos/airsoft-pecas-internas-para-replicas-de-airsoft/filter?d=229" },
  { slug: "pistolas",       label: "Peças para Pistolas",     url: "https://www.arsenalsports.com/produtos/airsoft-pecas-exclusivas-para-pistolas/filter?d=423" },
  { slug: "rifles-gas",     label: "Peças para Rifles a Gás", url: "https://www.arsenalsports.com/produtos/airsoft-pecas-exclusivas-para-rifles-a-gas/filter?d=214" },
  { slug: "sniper",         label: "Peças para Sniper",       url: "https://www.arsenalsports.com/produtos/airsoft-pecas-exclusivas-para-sniper/filter?d=424" },
  { slug: "magazines",      label: "Magazines",               url: "https://www.arsenalsports.com/produtos/airsoft-magazines-para-replicas-de-airsoft/filter?d=114" },
  { slug: "bbs",            label: "BBs",                     url: "https://www.arsenalsports.com/produtos/airsoft-bbs-/filter?d=163" },
  { slug: "gas",            label: "Gas / CO2 / HPA",         url: "https://www.arsenalsports.com/produtos/airsoft-green-gas--co2--hpa/filter?d=176" },
  { slug: "baterias",       label: "Baterias & Carregadores", url: "https://www.arsenalsports.com/produtos/airsoft-baterias--carregadores/filter?d=104" },
  { slug: "granadas",       label: "Granadas",                url: "https://www.arsenalsports.com/produtos/airsoft-granadas-de-airsoft/filter?d=184" },
  { slug: "speedsoft",      label: "Speedsoft",               url: "https://www.arsenalsports.com/produtos/airsoft-speedsoft/filter?d=256" },
  { slug: "miras",          label: "Miras e Red Dots",        url: "https://www.arsenalsports.com/produtos/otica-e-iluminacao/filter?d=273" },
  { slug: "vestuario",      label: "Equipamento e Vestuário", url: "https://www.arsenalsports.com/produtos/equipamento-e-vestuario/filter?d=381" },
];

export const MAX_PAGES = 150;
export const PAGE_PARAM = "pagina";

// Exclude non-airsoft related words based on user request (wellness, outside scope)
export const EXCLUDED_KEYWORDS = [
  "wellness",
  "fitness",
  "yoga",
  "chaveiro", // keychain
  "adesivo", // sticker
  "caneca", // mug
  "mouse pad"
];

// Returns true if product should be kept, false if it should be excluded
export function isValidProduct(name: string): boolean {
  const lowerName = name.toLowerCase();
  for (const keyword of EXCLUDED_KEYWORDS) {
    if (lowerName.includes(keyword)) {
      return false;
    }
  }
  return true;
}
