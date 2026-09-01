import soleilImg from "@/assets/perfume-soleil.jpg";
import bleuImg from "@/assets/perfume-bleu.jpg";
import roseImg from "@/assets/perfume-rose.jpg";
import fumeeImg from "@/assets/perfume-fumee.jpg";
import nocturneImg from "@/assets/perfume-nocturne.jpg";

export interface Perfume {
  id: string;
  number: string;
  name: string;
  italicName?: string;
  notes: string;
  family: string;
  description: string;
  price: number;
  size: string;
  image: string;
  noteTags: string[];
}

export const perfumes: Perfume[] = [
  {
    id: "soleil-dor",
    number: "Nº 01",
    name: "Soleil d'Or",
    notes: "Neroli · Bergamot",
    family: "Eau de Parfum",
    description:
      "The first warm hour of morning — bright neroli over golden amber.",
    price: 180,
    size: "50 ml",
    image: soleilImg,
    noteTags: ["Neroli", "Bergamote", "Miel Doré"],
  },
  {
    id: "bleu-minuit",
    number: "Nº 02",
    name: "Bleu Minuit",
    notes: "Vetiver · Cedar",
    family: "Eau de Parfum",
    description:
      "Midnight garden air — dark cedar roots and vetiver after rain.",
    price: 210,
    size: "50 ml",
    image: bleuImg,
    noteTags: ["Vétiver", "Cèdre", "Encens Bleu"],
  },
  {
    id: "rose-eternelle",
    number: "Nº 03",
    name: "Rose Éternelle",
    notes: "Damask Rose · Musk",
    family: "Eau de Parfum",
    description:
      "Damask rose gathered at dawn, wrapped in soft white musk.",
    price: 195,
    size: "50 ml",
    image: roseImg,
    noteTags: ["Rose Damascena", "Musc Blanc", "Litchi"],
  },
  {
    id: "vela-nocturne",
    number: "Nº 04",
    name: "Véla",
    italicName: "Nocturne",
    notes: "Amber Woods · Cool Smoke · White Musk",
    family: "Eau de Parfum",
    description:
      "Amber woods, cool smoke & white musk, layered like morning frost.",
    price: 245,
    size: "50 ml",
    image: nocturneImg,
    noteTags: ["Ambre", "Bois Fumés", "Musc Blanc"],
  },
  {
    id: "fumee-sauvage",
    number: "Nº 05",
    name: "Fumée Sauvage",
    notes: "Incense · Leather",
    family: "Extrait de Parfum",
    description:
      "Wild smoke over worn leather — the memory of a fire long out.",
    price: 230,
    size: "50 ml",
    image: fumeeImg,
    noteTags: ["Encens", "Cuir", "Genévrier"],
  },
];

export const featuredPerfume = perfumes.find((p) => p.id === "vela-nocturne") ?? perfumes[0];
