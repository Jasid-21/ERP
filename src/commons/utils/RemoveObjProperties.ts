/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export function removeObjectProperties(
  obj: Record<string, any>,
  properties: string[],
): Record<string, any> {
  const copy = Object.entries(obj).reduce(
    (prev, [propName, propValue]) => {
      if (properties.some((p) => p === propName)) return prev;
      prev[propName] = propValue;

      return prev;
    },
    {} as Record<string, any>,
  );
  return copy;
}
