import { a } from "./cycle-a.js";

export const b = "b";
export const aFromB = () => a;
