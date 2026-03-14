import { describe, expect, it } from "vitest";
import { isCommitmentOverdue } from "./commitments";

describe("isCommitmentOverdue", () => {
  it("returns false when status is cumprido", () => {
    expect(isCommitmentOverdue("2000-01-01", "cumprido")).toBe(false);
  });

  it("returns true for past date and pending status", () => {
    expect(isCommitmentOverdue("2000-01-01", "pendente")).toBe(true);
  });
});
