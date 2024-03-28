export const locations = Array.from({ length: 250 }, (_, index) => ({
  x: Math.random() * 879,
  y: index * 60,
}))
