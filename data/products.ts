export type Product = {
  id: string;
  name: string;
  category: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  quantity: number;
  price: number;
  updatedAt: string;
};

export const sampleProducts: Product[] = [
  {
    id: "PRD-001",
    name: "Organic Cocoa Beans",
    category: "Raw Produce",
    status: "In Stock",
    quantity: 340,
    price: 480,
    updatedAt: "2024-07-12"
  },
  {
    id: "PRD-002",
    name: "Atlantic Smoked Fish",
    category: "Frozen",
    status: "Low Stock",
    quantity: 38,
    price: 920,
    updatedAt: "2024-07-11"
  },
  {
    id: "PRD-003",
    name: "Premium Palm Oil",
    category: "Oil & Condiments",
    status: "In Stock",
    quantity: 122,
    price: 650,
    updatedAt: "2024-07-08"
  },
  {
    id: "PRD-004",
    name: "Sun-dried Tomatoes",
    category: "Preserved",
    status: "Out of Stock",
    quantity: 0,
    price: 300,
    updatedAt: "2024-07-05"
  }
];
