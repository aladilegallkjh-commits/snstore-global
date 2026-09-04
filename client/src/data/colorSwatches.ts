const normalizeColor = (color?: string) =>
  (color || "default")
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const swatchBackgrounds: Record<string, string> = {
  preto: "linear-gradient(135deg, #3d444c 0%, #1b2026 45%, #080b0f 100%)",
  branco: "linear-gradient(135deg, #ffffff 0%, #f2f5f7 50%, #cfd7de 100%)",
  prata: "linear-gradient(135deg, #f7f9fb 0%, #d6dce2 38%, #9da8b2 72%, #eef2f5 100%)",
  silver: "linear-gradient(135deg, #f7f9fb 0%, #d6dce2 38%, #9da8b2 72%, #eef2f5 100%)",
  azul: "linear-gradient(135deg, #91b5d4 0%, #5a7fa2 42%, #304e6b 78%, #88acd0 100%)",
  "deep-blue": "linear-gradient(135deg, #789bc0 0%, #426487 42%, #203a55 80%, #6f94ba 100%)",
  "mist-blue": "linear-gradient(135deg, #b4cde0 0%, #8daec9 50%, #5f839f 100%)",
  laranja: "linear-gradient(135deg, #ffad63 0%, #ff751e 42%, #d94c0b 78%, #ff9342 100%)",
  lavanda: "linear-gradient(135deg, #e0d5ef 0%, #bca8d4 48%, #816d9c 100%)",
  roxo: "linear-gradient(135deg, #dfd0ee 0%, #b59acb 50%, #765b8f 100%)",
  verde: "linear-gradient(135deg, #b4c7ad 0%, #819d79 52%, #4c664d 100%)",
  sage: "linear-gradient(135deg, #b4c7ad 0%, #819d79 52%, #4c664d 100%)",
  rosa: "linear-gradient(135deg, #f6cbd2 0%, #e89ca9 48%, #a65e6d 100%)",
  rose: "linear-gradient(135deg, #f0c4ca 0%, #d99aa7 48%, #925c69 100%)",
  estelar: "linear-gradient(135deg, #f5f0df 0%, #d9d0b9 48%, #9b907b 100%)",
  "meia-noite": "linear-gradient(135deg, #43566f 0%, #202d41 50%, #0b121d 100%)",
  midnight: "linear-gradient(135deg, #43566f 0%, #202d41 50%, #0b121d 100%)",
  natural: "linear-gradient(135deg, #e1c5a3 0%, #bda17f 48%, #80664e 100%)",
  desert: "linear-gradient(135deg, #c3a892 0%, #9b7f69 50%, #604a3d 100%)",
  cinza: "linear-gradient(135deg, #b7bec5 0%, #7f878f 50%, #454c54 100%)",
  dourado: "linear-gradient(135deg, #f2d28c 0%, #cfad6e 50%, #8b6a32 100%)",
  vermelho: "linear-gradient(135deg, #e7797b 0%, #b63c41 50%, #681d24 100%)",
  amarelo: "linear-gradient(135deg, #f5db72 0%, #e0bb43 52%, #99791d 100%)",
  default: "linear-gradient(135deg, #c9e8ff 0%, #8dbfe4 50%, #4d83aa 100%)",
};

export function getColorSwatchBackground(color?: string) {
  const normalized = normalizeColor(color);
  if (swatchBackgrounds[normalized]) return swatchBackgrounds[normalized];
  const matchingKey = Object.keys(swatchBackgrounds).find((key) => normalized.includes(key) || key.includes(normalized));
  return matchingKey ? swatchBackgrounds[matchingKey] : swatchBackgrounds.default;
}

export function getColorSwatchBorder(color?: string) {
  const normalized = normalizeColor(color);
  if (["preto", "meia-noite", "midnight", "azul", "deep-blue"].some((key) => normalized.includes(key))) return "rgba(184, 218, 244, .72)";
  return "rgba(255, 255, 255, .68)";
}
