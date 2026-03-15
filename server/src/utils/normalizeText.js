export function normalizeText(text = "") {
    return String(text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\bphuong thuc\s*([1-4])\b/g, "pt$1")
        .replace(/\bpt\s*([1-4])\b/g, "pt$1")
        .replace(/\bv\s*sat\b/g, "vsat")
        .replace(/\s+/g, " ")
        .trim();
}