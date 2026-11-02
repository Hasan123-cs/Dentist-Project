export function normalizeWhatsAppPhone(phone) {
  let digits = String(phone || "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("00961")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("961")) {
    digits = digits.slice(3);
  }

  return `961${digits.replace(/^0/, "")}`;
}

export function createWhatsAppUrl(phone, message) {
  const normalizedPhone = normalizeWhatsAppPhone(phone);

  if (!normalizedPhone) {
    return null;
  }

  return `https://api.whatsapp.com/send?phone=${normalizedPhone}&text=${encodeURIComponent(message)}`;
}
