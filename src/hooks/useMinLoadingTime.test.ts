import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMinLoadingTime } from "./useMinLoadingTime";

describe("useMinLoadingTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return false initially", () => {
    const { result } = renderHook(() => useMinLoadingTime());
    expect(result.current).toBe(false);
  });

  it("should return true after default time (1000ms)", () => {
    const { result } = renderHook(() => useMinLoadingTime());

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true);
  });

  it("should return true after custom time", () => {
    const { result } = renderHook(() => useMinLoadingTime({ minTime: 500 }));

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });
});
