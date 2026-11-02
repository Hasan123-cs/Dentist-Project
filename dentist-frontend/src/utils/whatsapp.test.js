import { createWhatsAppUrl, normalizeWhatsAppPhone } from "./whatsapp";
import { formatLebanonDateTime } from "./dateTime";

describe("WhatsApp helpers", () => {
  test.each([
    ["03123456", "9613123456"],
    ["+961 3 123 456", "9613123456"],
    ["00961 3 123 456", "9613123456"],
    ["9613123456", "9613123456"],
  ])("normalizes %s to %s", (phone, expected) => {
    expect(normalizeWhatsAppPhone(phone)).toBe(expected);
  });

  test("encodes and preserves emoji and Arabic in the WhatsApp message", () => {
    const message = "موعدك 🌸 🦷 📅 ⏰ 📞 🤍";
    const whatsappUrl = createWhatsAppUrl("03123456", message);
    const parsedUrl = new URL(whatsappUrl);

    expect(parsedUrl.origin + parsedUrl.pathname).toBe(
      "https://api.whatsapp.com/send",
    );
    expect(parsedUrl.searchParams.get("phone")).toBe("9613123456");
    expect(whatsappUrl).toContain(
      "text=%D9%85%D9%88%D8%B9%D8%AF%D9%83%20%F0%9F%8C%B8",
    );
    expect(parsedUrl.searchParams.get("text")).toBe(message);
  });

  test("does not create a WhatsApp link without a phone number", () => {
    expect(createWhatsAppUrl("", "Hello")).toBeNull();
  });

  test("formats UTC appointment times in the Lebanon timezone", () => {
    expect(
      formatLebanonDateTime("2026-01-15T07:00:00Z", "HH:mm"),
    ).toBe("09:00");
  });
});
