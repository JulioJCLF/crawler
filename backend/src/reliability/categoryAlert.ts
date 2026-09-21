// REQ-019: decide o que fazer com a Issue de alerta de queda de categoria.
// Mesmo padrão de REQ-018 (failureAlert.ts), mas rótulo e critério de disparo
// são outros — a execução em si não falhou (RN2).
import type { CategoryDrop } from "./categoryDrop.js";

export const CATEGORY_ALERT_LABEL = "alerta-categoria";
export const CATEGORY_ALERT_TITLE = "arsenal-watch: queda brusca de produtos numa categoria";

export function buildCategoryAlertBody(drops: CategoryDrop[], now: string): string {
  const linhas = drops.map(
    (d) => `- **${d.label}** (\`${d.slug}\`): ${d.previousCount} → ${d.currentCount}`
  );
  return [
    `Queda brusca detectada em ${drops.length} categoria(s) na execução de ${now}:`,
    "",
    ...linhas,
    "",
    "O site pode ter mudado de estrutura, ou o crawler parou de reconhecer a categoria. O snapshot foi salvo normalmente — este alerta não bloqueia a publicação (REQ-019).",
    "",
    "Esta Issue fecha sozinha quando uma próxima execução não detectar mais nenhuma queda.",
  ].join("\n");
}

export function buildCategoryRecoveryComment(now: string): string {
  return `Nenhuma queda de categoria detectada na execução de ${now}. Fechando o alerta.`;
}

export type CategoryAlertAction =
  | { type: "create"; title: string; body: string; label: string }
  | { type: "update"; issueNumber: number; body: string }
  | { type: "close"; issueNumber: number; comment: string }
  | { type: "none" };

export interface DecideCategoryAlertActionParams {
  drops: CategoryDrop[];
  existingOpenIssueNumber: number | null;
  now: string;
}

export function decideCategoryAlertAction({
  drops,
  existingOpenIssueNumber,
  now,
}: DecideCategoryAlertActionParams): CategoryAlertAction {
  if (drops.length > 0) {
    const body = buildCategoryAlertBody(drops, now);
    if (existingOpenIssueNumber != null) {
      return { type: "update", issueNumber: existingOpenIssueNumber, body };
    }
    return { type: "create", title: CATEGORY_ALERT_TITLE, body, label: CATEGORY_ALERT_LABEL };
  }

  if (existingOpenIssueNumber != null) {
    return {
      type: "close",
      issueNumber: existingOpenIssueNumber,
      comment: buildCategoryRecoveryComment(now),
    };
  }

  return { type: "none" };
}
