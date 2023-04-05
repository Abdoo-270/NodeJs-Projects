filters = "price-$gt-40,rating-$gt-4";
filtersArray = filters.split(",").forEach((item) => {
  const [field, operator, value] = item.split("-");
});

console.log(filtersArray);
