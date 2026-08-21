import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

async function loadFlutterwave() {
  vi.resetModules();
  return import("@/lib/flutterwave");
}

describe("flutterwave", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    process.env.FLUTTERWAVE_SECRET_KEY = "FLWSECK_TEST-live-key";
    process.env.FLUTTERWAVE_SECRET_HASH = "whsec_live_hash";
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    vi.unstubAllGlobals();
  });

  describe("buildReference", () => {
    it("prefixes the reference and keeps it URL-safe", async () => {
      const { buildReference } = await loadFlutterwave();
      const reference = buildReference("cx_course");
      expect(reference).toMatch(/^cx_course_[0-9a-z]+_[0-9a-f]{12}$/);
    });

    it("generates distinct references on successive calls", async () => {
      const { buildReference } = await loadFlutterwave();
      const a = buildReference("cx_course");
      const b = buildReference("cx_course");
      expect(a).not.toBe(b);
    });
  });

  describe("isFlutterwaveConfigured", () => {
    it("is false when the secret key is unset", async () => {
      delete process.env.FLUTTERWAVE_SECRET_KEY;
      const { isFlutterwaveConfigured } = await loadFlutterwave();
      expect(isFlutterwaveConfigured()).toBe(false);
    });

    it("is false when the secret key is still the example DUMMY value", async () => {
      process.env.FLUTTERWAVE_SECRET_KEY = "FLWSECK_TEST-DUMMY";
      const { isFlutterwaveConfigured } = await loadFlutterwave();
      expect(isFlutterwaveConfigured()).toBe(false);
    });

    it("is true when a real-looking secret key is set", async () => {
      const { isFlutterwaveConfigured } = await loadFlutterwave();
      expect(isFlutterwaveConfigured()).toBe(true);
    });
  });

  describe("initializeTransaction", () => {
    it("converts kobo to naira and returns the hosted checkout link", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "success",
            message: "Hosted Link",
            data: { link: "https://checkout.flutterwave.com/v3/hosted/pay/abc123" },
          }),
          { status: 200 },
        ),
      );
      vi.stubGlobal("fetch", fetchMock);

      const { initializeTransaction } = await loadFlutterwave();
      const result = await initializeTransaction({
        email: "learner@example.com",
        amountKobo: 1_800_000,
        reference: "cx_course_ref",
        callbackUrl: "https://caxtonhub.com/checkout/callback",
        metadata: { courseSlug: "frontend-engineering-react-nextjs" },
      });

      expect(result).toEqual({
        authorization_url: "https://checkout.flutterwave.com/v3/hosted/pay/abc123",
        reference: "cx_course_ref",
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe("https://api.flutterwave.com/v3/payments");
      expect(init.headers.Authorization).toBe("Bearer FLWSECK_TEST-live-key");

      const body = JSON.parse(init.body as string);
      expect(body).toMatchObject({
        tx_ref: "cx_course_ref",
        amount: 18_000, // naira, not kobo
        currency: "NGN",
        redirect_url: "https://caxtonhub.com/checkout/callback",
        customer: { email: "learner@example.com" },
        meta: { courseSlug: "frontend-engineering-react-nextjs" },
      });
    });

    it("throws without hitting the network when the secret key is not configured", async () => {
      delete process.env.FLUTTERWAVE_SECRET_KEY;
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      const { initializeTransaction, FlutterwaveError } = await loadFlutterwave();
      await expect(
        initializeTransaction({
          email: "learner@example.com",
          amountKobo: 1_800_000,
          reference: "cx_course_ref",
          callbackUrl: "https://caxtonhub.com/checkout/callback",
        }),
      ).rejects.toBeInstanceOf(FlutterwaveError);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("surfaces Flutterwave's error message on a failed request", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ status: "error", message: "Invalid amount" }), {
            status: 400,
          }),
        ),
      );

      const { initializeTransaction, FlutterwaveError } = await loadFlutterwave();
      await expect(
        initializeTransaction({
          email: "learner@example.com",
          amountKobo: 1_800_000,
          reference: "cx_course_ref",
          callbackUrl: "https://caxtonhub.com/checkout/callback",
        }),
      ).rejects.toThrow(new FlutterwaveError("Invalid amount"));
    });
  });

  describe("verifyTransaction", () => {
    function mockVerifyResponse(data: Record<string, unknown>) {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ status: "success", data }), { status: 200 }),
        ),
      );
    }

    it("converts a successful transaction back to kobo and normalises the status", async () => {
      mockVerifyResponse({
        tx_ref: "cx_course_ref",
        status: "successful",
        amount: 18_000,
        currency: "NGN",
        payment_type: "card",
        created_at: "2026-08-21T10:00:00.000Z",
        customer: { email: "learner@example.com" },
        meta: { courseSlug: "frontend-engineering-react-nextjs" },
      });

      const { verifyTransaction } = await loadFlutterwave();
      const result = await verifyTransaction("cx_course_ref");

      expect(result).toEqual({
        status: "success",
        reference: "cx_course_ref",
        amount: 1_800_000,
        currency: "NGN",
        channel: "card",
        paid_at: "2026-08-21T10:00:00.000Z",
        customer: { email: "learner@example.com" },
        metadata: { courseSlug: "frontend-engineering-react-nextjs" },
      });
    });

    it("maps a cancelled transaction to abandoned, matching Paystack's vocabulary", async () => {
      mockVerifyResponse({
        tx_ref: "cx_course_ref",
        status: "cancelled",
        amount: 18_000,
        currency: "NGN",
      });

      const { verifyTransaction } = await loadFlutterwave();
      const result = await verifyTransaction("cx_course_ref");
      expect(result.status).toBe("abandoned");
    });

    it("passes an unrecognised status straight through", async () => {
      mockVerifyResponse({
        tx_ref: "cx_course_ref",
        status: "failed",
        amount: 18_000,
        currency: "NGN",
      });

      const { verifyTransaction } = await loadFlutterwave();
      const result = await verifyTransaction("cx_course_ref");
      expect(result.status).toBe("failed");
    });

    it("requests verification by reference, not by Flutterwave's internal id", async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: "success",
            data: { tx_ref: "cx_course_ref", status: "successful", amount: 100, currency: "NGN" },
          }),
          { status: 200 },
        ),
      );
      vi.stubGlobal("fetch", fetchMock);

      const { verifyTransaction } = await loadFlutterwave();
      await verifyTransaction("cx_course_ref");

      const [url] = fetchMock.mock.calls[0];
      expect(url).toBe(
        "https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=cx_course_ref",
      );
    });
  });

  describe("isValidWebhookSignature", () => {
    it("accepts a header that matches the configured secret hash", async () => {
      const { isValidWebhookSignature } = await loadFlutterwave();
      expect(isValidWebhookSignature("whsec_live_hash")).toBe(true);
    });

    it("rejects a header that does not match", async () => {
      const { isValidWebhookSignature } = await loadFlutterwave();
      expect(isValidWebhookSignature("someone-elses-hash")).toBe(false);
    });

    it("rejects a missing header", async () => {
      const { isValidWebhookSignature } = await loadFlutterwave();
      expect(isValidWebhookSignature(null)).toBe(false);
    });

    it("throws if the secret hash is not configured on this deployment", async () => {
      delete process.env.FLUTTERWAVE_SECRET_HASH;
      const { isValidWebhookSignature, FlutterwaveError } = await loadFlutterwave();
      expect(() => isValidWebhookSignature("anything")).toThrow(FlutterwaveError);
    });
  });
});
