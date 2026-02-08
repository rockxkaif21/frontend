import { Product, buildStatus, sampleProducts } from "../data/products";
import { Role, Session } from "./auth";

let productsDb: Product[] = [...sampleProducts];

const delay = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const deriveRole = (email: string): Role => (email.toLowerCase().includes("manager") ? "manager" : "store-keeper");

export const loginRequest = async (payload: { email: string; password: string }): Promise<Session> => {
  await delay(250);
  if (!payload.email.includes("@") || payload.password.length < 4) {
    throw new Error("Invalid credentials.");
  }
  const role = deriveRole(payload.email);
  return {
    email: payload.email.toLowerCase(),
    role,
    name: role === "manager" ? "Ayo Manager" : "Sade Store Keeper"
  };
};

export const getProducts = async (): Promise<Product[]> => {
  await delay(200);
  return [...productsDb];
};

export const createProduct = async (input: Omit<Product, "id" | "updatedAt" | "status">): Promise<Product> => {
  await delay(200);
  const next: Product = {
    ...input,
    id: `PRD-${String(productsDb.length + 1).padStart(3, "0")}`,
    status: buildStatus(input.quantity),
    updatedAt: new Date().toISOString().slice(0, 10)
  };
  productsDb = [next, ...productsDb];
  return next;
};

export const updateProduct = async (
  id: string,
  patch: Partial<Pick<Product, "name" | "category" | "quantity" | "price">>
): Promise<Product> => {
  await delay(200);
  const target = productsDb.find((item) => item.id === id);
  if (!target) {
    throw new Error("Product not found.");
  }

  const updated: Product = {
    ...target,
    ...patch,
    quantity: patch.quantity ?? target.quantity,
    price: patch.price ?? target.price,
    status: buildStatus(patch.quantity ?? target.quantity),
    updatedAt: new Date().toISOString().slice(0, 10)
  };

  productsDb = productsDb.map((item) => (item.id === id ? updated : item));
  return updated;
};
