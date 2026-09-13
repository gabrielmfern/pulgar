import { b } from "./cycle-b.js";

export const a = "a";
export const bFromA = () => b;
