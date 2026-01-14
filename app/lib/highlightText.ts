export function highlightText(
  text: string,
  highlights: { word: string; className: string }[]
): string {
  let result = text;

  highlights.forEach(({ word, className }) => {
    if (!word) return;

    const pattern = new RegExp(`(${word})`, "gi");
    result = result.replace(
      pattern,
      `<span class="${className} font-inherit">$1</span>`
    );
  });

  return result;
}
