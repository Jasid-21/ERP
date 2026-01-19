/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export class MatchObj {
  properties: MatchProperty[];

  constructor(...properties: MatchProperty[]) {
    this.properties = properties;
  }

  compare(obj: Record<string, any>, exact: boolean = true): boolean {
    if (!obj) return false;
    const objProperties = Object.entries(obj);
    const partialMatch = this.properties.every((prop) => {
      const match = objProperties.find(([name]) => name == prop.name);
      if (!match) return false;

      const value = match[1];
      if ((value === null || prop.value === null) && value != prop.value)
        return false;

      return prop.value.some((v) => {
        if (v instanceof MatchObj) return v.compare(value);
        return typeof v === typeof value;
      });
    });

    return (
      partialMatch &&
      (!exact || objProperties.length === this.properties.length)
    );
  }
}

export class MatchProperty {
  name: string;
  value: any[];
  isRequired: boolean;

  constructor(name: string, value: any, isRequired: boolean = true) {
    this.name = name;
    this.value = value;
    this.isRequired = isRequired;
  }
}
