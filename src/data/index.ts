import * as _settings from "./settings.json";

export type restaurants_tags = keyof typeof _settings.restaurants_tags;
export interface Settings {
  "restaurants_tags": restaurants_tags[];
  "restaurants_per_page": number;
}

export const settings = _settings as Settings;