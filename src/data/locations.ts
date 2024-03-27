export const locations = Array.from({ length: 250 }, (_, index) => ({
  x: Math.random() * 1030,
  y: index * 30,
}))
