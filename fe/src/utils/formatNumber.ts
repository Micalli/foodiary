export const formatNumber = (value: number| undefined) => {
  if (!value) return
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};
