import { ApolloClient, ApolloLink, InMemoryCache, Observable } from "@apollo/client";
import { createProduct, getProducts, loginRequest, updateProduct } from "./mockApi";

const mockLink = new ApolloLink((operation) =>
  new Observable((observer) => {
    (async () => {
      switch (operation.operationName) {
        case "Login": {
          const { email, password } = operation.variables;
          const session = await loginRequest({ email, password });
          observer.next({ data: { login: session } });
          break;
        }
        case "GetProducts": {
          const products = await getProducts();
          observer.next({ data: { products } });
          break;
        }
        case "CreateProduct": {
          const { name, category, quantity, price } = operation.variables;
          const product = await createProduct({ name, category, quantity, price });
          observer.next({ data: { createProduct: product } });
          break;
        }
        case "UpdateProduct": {
          const { id, name, category, quantity, price } = operation.variables;
          const product = await updateProduct(id, { name, category, quantity, price });
          observer.next({ data: { updateProduct: product } });
          break;
        }
        default:
          observer.error(new Error(`Unknown GraphQL operation: ${operation.operationName}`));
          return;
      }
      observer.complete();
    })().catch((error) => observer.error(error));
  })
);

export const apolloClient = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache()
});
