export const formatPrice = (price: number) =>
  price.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

export const formatDate = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("fr-FR");
