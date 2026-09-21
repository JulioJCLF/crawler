// REQ-018: decide o que fazer com a Issue de alerta de falha do arsenal-watch.
// Mantido como funções puras para ser testável sem depender do GitHub CLI.

export const FAILURE_ISSUE_LABEL = "alerta-execucao";
export const FAILURE_ISSUE_TITLE = "arsenal-watch: execução diária falhou";

export function buildFailureIssueBody(runUrl: string, now: string): string {
  return [
    `A execução do arsenal-watch falhou em ${now}.`,
    "",
    `Detalhes: ${runUrl}`,
    "",
    "Esta Issue fecha sozinha quando uma próxima execução terminar com sucesso (REQ-018).",
  ].join("\n");
}

export function buildRecoveryComment(now: string): string {
  return `Execução de ${now} terminou com sucesso. Fechando o alerta.`;
}

export type FailureAction =
  | { type: "create"; title: string; body: string; label: string }
  | { type: "update"; issueNumber: number; body: string }
  | { type: "close"; issueNumber: number; comment: string }
  | { type: "none" };

export interface DecideFailureActionParams {
  executionFailed: boolean;
  existingOpenIssueNumber: number | null;
  runUrl: string;
  now: string;
}

// RN1-RN2 do REQ-018: falha sem Issue aberta cria; falha com Issue aberta
// atualiza (não duplica); sucesso com Issue aberta fecha; sucesso sem Issue
// aberta não faz nada.
export function decideFailureAction({
  executionFailed,
  existingOpenIssueNumber,
  runUrl,
  now,
}: DecideFailureActionParams): FailureAction {
  if (executionFailed) {
    if (existingOpenIssueNumber != null) {
      return {
        type: "update",
        issueNumber: existingOpenIssueNumber,
        body: buildFailureIssueBody(runUrl, now),
      };
    }
    return {
      type: "create",
      title: FAILURE_ISSUE_TITLE,
      body: buildFailureIssueBody(runUrl, now),
      label: FAILURE_ISSUE_LABEL,
    };
  }

  if (existingOpenIssueNumber != null) {
    return {
      type: "close",
      issueNumber: existingOpenIssueNumber,
      comment: buildRecoveryComment(now),
    };
  }

  return { type: "none" };
}
