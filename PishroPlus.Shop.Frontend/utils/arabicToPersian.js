export function arabicToPersian(str) {
  if (!str) return str;
  
  const diff = {
    ة: "ه",
    ك: "ک",
    دِ: "د",
    بِ: "ب",
    زِ: "ز",
    ذِ: "ذ",
    شِ: "ش",
    سِ: "س",
    ى: "ی",
    ي: "ی",
    "٠": "۰",
    "١": "۱",
    "٢": "۲",
    "٣": "۳",
    "٤": "۴",
    "٥": "۵",
    "٦": "۶",
    "٧": "۷",
    "٨": "۸",
    "٩": "۹",
  };

  for (const [key, value] of Object.entries(diff)) {
    str = str.replaceAll(key, value);
  }
  return str;
}