import { en } from "./en";
import { pt } from "./pt";
 

export async function getDictionary(lang: string) {
 
  if (lang === "pt") return pt;
 
  return en;
}