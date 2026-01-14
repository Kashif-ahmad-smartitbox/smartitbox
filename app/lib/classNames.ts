export const classNames = (...inputs: Array<string | false | null | undefined>) =>
  inputs.filter(Boolean).join(" ");
