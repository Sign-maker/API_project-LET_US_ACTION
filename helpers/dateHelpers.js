export const getDayBorders = (startOfDay) => {
  const dayStart = new Date(startOfDay);
  const dayEnd = new Date(startOfDay);
  dayEnd.setDate(dayEnd.getDate() + 1);
  return { dayStart, dayEnd };
};
