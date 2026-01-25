import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore } from "./userStore";

describe("userStore", () => {
  beforeEach(() => {
    useUserStore.setState({ userId: undefined });
  });

  it("should have undefined userId initially", () => {
    const { userId } = useUserStore.getState();
    expect(userId).toBeUndefined();
  });

  it("should set userId", () => {
    const { setUserId } = useUserStore.getState();
    setUserId("user-123");

    const { userId } = useUserStore.getState();
    expect(userId).toBe("user-123");
  });
});
