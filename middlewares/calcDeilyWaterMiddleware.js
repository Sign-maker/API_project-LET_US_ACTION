// Мідлвара для обробки розрахунку кількості води
export const calcDeilyWaterMiddleware = (req, res, next) => {
  // Отримання даних з тіла запиту
  const { gender, weight, time, consumedWater } = req.body;

  // Обчислення на основі статі, ваги та часу
  let calculatedWater = 0;
  if (gender === "woman") {
    calculatedWater = weight * 0.03 + time * 0.4;
  } else if (gender === "man") {
    calculatedWater = weight * 0.04 + time * 0.6;
  }

  // Перевірка на валідність обчисленої кількості води
  if (isNaN(calculatedWater) || calculatedWater <= 0) {
    return res.status(400).json({ error: "Невірний розрахунок" });
  }

  // Порівняння обчисленої кількості води з випитою
  if (consumedWater < calculatedWater) {
    return res.status(400).json({ error: "Ви повинні пити більше води" });
  }

  // Якщо всі перевірки пройшли успішно, продовжуємо виконання наступного мідлвару або обробник маршруту
  next();
};
