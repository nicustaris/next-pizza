const currencyFormat = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function currencyFormatter(price: number) {
  return currencyFormat.format(price);
}
