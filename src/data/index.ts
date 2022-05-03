import * as _settings from "./settings.json";
export interface Settings {
  restaurants_tags: string[];
  restaurants_per_page: number;
}

export const settings = _settings as Settings;