import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import Comments from "../Comments";
import { useState } from "react";
import ProductForm from "../ProductForm";

export default function Product() {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  console.log(isEditMode);
  const { data: product, isLoading, mutate } = useSWR(`/api/products/${id}`);

  async function handleEditProduct(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      mutate();
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!product) {
    return;
  }

  return (
    <ProductCard>
      <h2>{product.name}</h2>
      <p>Description: {product.description}</p>
      <p>
        Price: {product.price} {product.currency}
      </p>
      <button
        type="button"
        onClick={() => {
          setIsEditMode(!isEditMode);
        }}
      >
        Edit Product
      </button>
      {isEditMode === true ? (
        <ProductForm onSubmit={handleEditProduct} isEditMode={isEditMode} />
      ) : null}
      {product.reviews.length > 0 && <Comments reviews={product.reviews} />}
      <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
// - Create a state called `isEditMode` and initialize it with `false`.
// - In the return statement, add a `<button>` with
//   - `type="button"`,
//   - `onClick={() => { setIsEditMode(!isEditMode); }}`,
//   - and a proper text.
// - In the return statement, display the `ProductForm` component depending on the `isEditMode` state (Hint: `isEditMode && ...`).
// - pass our `handleEditProduct` function to the `ProductForm` as the `onSubmit` prop.
