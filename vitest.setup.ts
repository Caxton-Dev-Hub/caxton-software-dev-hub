import { vi } from "vitest";

// The real "server-only" package throws when Vite resolves its browser
// condition, which happens under Vitest's default Node environment too.
// Stub it so lib modules that import it for safety can still be unit tested.
vi.mock("server-only", () => ({}));
