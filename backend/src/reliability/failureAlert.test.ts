import { describe, it, expect } from "vitest";
import { decideFailureAction, FAILURE_ISSUE_LABEL } from "./failureAlert.js";

const runUrl = "https://github.com/JulioJCLF/crawler/actions/runs/123";
const now = "2026-09-21T09:00:00.000Z";

describe("decideFailureAction (REQ-018)", () => {
  it("cria uma Issue quando a execução falha e não há Issue de falha aberta", () => {
    const action = decideFailureAction({
      executionFailed: true,
      existingOpenIssueNumber: null,
      runUrl,
      now,
    });

    expect(action.type).toBe("create");
    if (action.type === "create") {
      expect(action.label).toBe(FAILURE_ISSUE_LABEL);
      expect(action.body).toContain(runUrl);
    }
  });

  it("atualiza a Issue existente em vez de criar uma duplicada quando falha de novo", () => {
    const action = decideFailureAction({
      executionFailed: true,
      existingOpenIssueNumber: 42,
      runUrl,
      now,
    });

    expect(action).toEqual({
      type: "update",
      issueNumber: 42,
      body: expect.stringContaining(runUrl),
    });
  });

  it("fecha a Issue de falha quando a execução seguinte termina com sucesso", () => {
    const action = decideFailureAction({
      executionFailed: false,
      existingOpenIssueNumber: 42,
      runUrl,
      now,
    });

    expect(action.type).toBe("close");
    if (action.type === "close") {
      expect(action.issueNumber).toBe(42);
    }
  });

  it("não faz nada quando a execução termina bem e não há Issue de falha aberta", () => {
    const action = decideFailureAction({
      executionFailed: false,
      existingOpenIssueNumber: null,
      runUrl,
      now,
    });

    expect(action).toEqual({ type: "none" });
  });
});
