export const cssUnitPair = (value: string): [number, string] => {
  const match = /^(-?[\d.]+)([a-z%]*)$/i.exec(value.trim());

  if (!match) {
    console.warn(`Invalid CSS unit value: "${value}"`);

    return [1, 'rem'];
  }
  const number = parseFloat(match[1]);
  const unit = match[2] || '';

  return [number, unit];
};
