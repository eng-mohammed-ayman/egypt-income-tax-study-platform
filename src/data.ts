import { part1 } from "./data/part1";
import { part2 } from "./data/part2";
import { part3 } from "./data/part3";
import { part4 } from "./data/part4";
import { part5 } from "./data/part5";
import { part6 } from "./data/part6";
import { part7 } from "./data/part7";
import { part8 } from "./data/part8";
import { part9 } from "./data/part9";
import { part10 } from "./data/part10";

export const data = {
  sections: [
    ...part1,
    ...part2,
    ...part3,
    ...part4,
    ...part5,
    ...part6,
    ...part7,
    ...part8,
    ...part9,
    ...part10,
  ],
} as const;
