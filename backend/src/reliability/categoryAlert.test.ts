import { describe, it, expect } from "vitest";
import { decideCategoryAlertAction, CATEGORY_ALERT_LABEL } from "./categoryAlert.js";
import type { CategoryDrop } from "./categoryDrop.js";

const now = "2026-09-21T09:00:00.000Z";
const drop: CategoryDrop = { slug: "bbs", label: "BBs", previousCount: 40, currentCount: 0 };

describe("decideCategoryAlertAction (REQ-019)", () => {
  it("cria Issue quando há queda e não existe Issue de categoria aberta", () => {
    const action = decideCategoryAlertAction({ drops: [drop], existingOpenIssueNumber: null, now });

    expect(action.type).toBe("create");
    if (action.type === "create") {
      expect(action.label).toBe(CATEGORY_ALERT_LABEL);
      expect(action.body).toContain("bbs");
    }
  });

  it("atualiza a Issue existente em vez de criar duplicada", () => {
    const action = decideCategoryAlertAction({ drops: [drop], existingOpenIssueNumber: 7, now });

    expect(action).toEqual({
      type: "update",
      issueNumber: 7,
      body: expect.stringContaining("bbs"),
    });
  });

  it("fecha a Issue quando não há mais queda detectada", () => {
    const action = decideCategoryAlertAction({ drops: [], existingOpenIssueNumber: 7, now });

    expect(action).toEqual({
      type: "close",
      issueNumber: 7,
      comment: expect.any(String),
    });
  });

  it("não faz nada quando não há queda e não há Issue aberta", () => {
    const action = decideCategoryAlertAction({ drops: [], existingOpenIssueNumber: null, now });

    expect(action).toEqual({ type: "none" });
  });
});
