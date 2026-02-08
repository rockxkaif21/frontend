import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import { Product } from "../data/products";
import { useAuth } from "../lib/auth";
import { CREATE_PRODUCT_MUTATION, GET_PRODUCTS_QUERY, UPDATE_PRODUCT_MUTATION } from "../lib/graphqlOperations";

type ProductsResponse = {
  products: Product[];
};

type CreateProductResponse = {
  createProduct: Product;
};

type UpdateProductResponse = {
  updateProduct: Product;
};

const ProductsPage = () => {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const deniedReason = typeof router.query.denied === "string" ? router.query.denied : null;

  const { data } = useQuery<ProductsResponse>(GET_PRODUCTS_QUERY, {
    skip: !session,
    fetchPolicy: "no-cache"
  });

  const [createProductMutation] = useMutation<CreateProductResponse>(CREATE_PRODUCT_MUTATION);
  const [updateProductMutation] = useMutation<UpdateProductResponse>(UPDATE_PRODUCT_MUTATION);

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);

  const summary = useMemo(() => {
    const total = products.length;
    const lowStock = products.filter((item) => item.status === "Low Stock").length;
    const outOfStock = products.filter((item) => item.status === "Out of Stock").length;
    return { total, lowStock, outOfStock };
  }, [products]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setQuantity("");
    setPrice("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!name || !category || !quantity || !price) {
      setFeedback("All fields are required.");
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedPrice = Number(price);

    if (Number.isNaN(parsedQuantity) || Number.isNaN(parsedPrice)) {
      setFeedback("Quantity and price must be numbers.");
      return;
    }

    if (parsedQuantity < 0 || parsedPrice <= 0) {
      setFeedback("Quantity must be ≥ 0 and price must be > 0.");
      return;
    }

    if (editingId) {
      const { data: updatedResponse } = await updateProductMutation({
        variables: {
          id: editingId,
          name,
          category,
          quantity: parsedQuantity,
          price: parsedPrice
        }
      });
      const updated = updatedResponse?.updateProduct;
      if (!updated) {
        setFeedback("Unable to update product.");
        return;
      }
      setProducts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setFeedback(`Updated ${updated.name}.`);
      resetForm();
      return;
    }

    const { data: createResponse } = await createProductMutation({
      variables: {
        name,
        category,
        quantity: parsedQuantity,
        price: parsedPrice
      }
    });
    const created = createResponse?.createProduct;
    if (!created) {
      setFeedback("Unable to create product.");
      return;
    }

    setProducts((prev) => [created, ...prev]);
    setFeedback(`Added ${created.name}.`);
    resetForm();
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setQuantity(String(product.quantity));
    setPrice(String(product.price));
    setFeedback(`Editing ${product.id}`);
  };

  if (!session) {
    return null;
  }

  return (
    <Layout>
      {deniedReason === "dashboard" ? (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
          Dashboard is restricted to Managers only. You were redirected to Products based on your role.
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="muted">Manage commodity inventory and product records.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
            Total: <span className="font-semibold">{summary.total}</span>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
            Low stock: <span className="font-semibold">{summary.lowStock}</span>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-2 text-sm dark:border-slate-700">
            Out of stock: <span className="font-semibold">{summary.outOfStock}</span>
          </div>
        </div>
      </div>

      <section className="card mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Product Inventory</h2>
            <p className="muted">GraphQL query <code>products</code> simulates GET /products.</p>
          </div>
          <button type="button" className="button-secondary" disabled={session.role !== "manager"}>
            {session.role === "manager" ? "Export Report" : "Export (Managers only)"}
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-700">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Status</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Price</th>
                <th className="py-2">Updated</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 font-medium">{product.id}</td>
                  <td className="py-3">{product.name}</td>
                  <td className="py-3">{product.category}</td>
                  <td className="py-3">
                    <span className="badge">{product.status}</span>
                  </td>
                  <td className="py-3">{product.quantity}</td>
                  <td className="py-3">₦{product.price.toLocaleString()}</td>
                  <td className="py-3">{product.updatedAt}</td>
                  <td className="py-3">
                    <button type="button" className="button-secondary" onClick={() => startEdit(product)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Add / Edit Products</h2>
            <p className="muted">GraphQL mutations <code>createProduct</code> and <code>updateProduct</code> simulate POST/PUT APIs.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">Accessible to Managers & Store Keepers</span>
        </div>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium">Product Name</label>
            <input className="input mt-2" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <input className="input mt-2" value={category} onChange={(event) => setCategory(event.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <input
              className="input mt-2"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Unit Price (₦)</label>
            <input
              className="input mt-2"
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <button className="button" type="submit">
              {editingId ? "Update Product" : "Save Product"}
            </button>
            {editingId ? (
              <button className="button-secondary" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
            {feedback ? <p className="text-sm text-emerald-600 dark:text-emerald-300">{feedback}</p> : null}
          </div>
        </form>
      </section>
    </Layout>
  );
};

export default ProductsPage;
