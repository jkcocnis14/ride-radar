export type Park = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

export const parks: Park[] = [
  {
    id: "75ea578a-adc8-4116-a54d-dccb60765ef9",
    name: "Magic Kingdom",
    emoji: "🏰",
    description: "The Most Magical Place on Earth",
  },
  {
    id: "47f90d2c-e191-4239-a466-5892ef59a88b",
    name: "EPCOT",
    emoji: "🌐",
    description: "World Discovery & World Showcase",
  },
  {
    id: "35109d5d-2f7c-4a5c-bbb6-72fdb9a8aaf7",
    name: "Hollywood Studios",
    emoji: "🎬",
    description: "Movies, adventure & a galaxy far away",
  },
  {
    id: "1c84a229-8862-4648-9c71-378ddd2c7693",
    name: "Animal Kingdom",
    emoji: "🌳",
    description: "Animals, adventure & Pandora",
  },
];