import { colorNames } from "../utils/colors";

function rgbaToHex(rgba: string): string {
  const [, r, g, b, a] = rgba
    .match(/^rgba\((.+), (.+), (.+), (.+)\)/)
    ?.map(Number);
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ];

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  });

  return "#" + outParts.join("");
}

export const monacoStyles = () => {
  const styles = getComputedStyle(document.documentElement);
  const monacoStyles: Record<string, string> = {};
  for (const color of colorNames) {
    const cssVariable = color.replace(/\./g, "-");
    const property = styles.getPropertyValue(`--vscode-${cssVariable}`);
    if (property) {
      monacoStyles[color] = property.startsWith("rgba")
        ? rgbaToHex(property)
        : property;
    }
  }
  return monacoStyles;
};
