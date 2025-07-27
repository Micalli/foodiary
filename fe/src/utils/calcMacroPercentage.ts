type MacroProgress = {
  goal: number;
  current: number;
};

export function calcMacroPercentage({ goal, current }: MacroProgress) {
  const percentage = (current / goal) * 100;



  return Math.min(percentage, 100)
}

export function calcMicroPercentage({ proteins, carbs, fats }: { proteins: number; carbs: number; fats: number }) {
  const total = proteins + carbs + fats;
  if (total === 0) return { proteins: 0, carbs: 0, fats: 0 };

  return {
    proteins: (proteins / total) * 100,
    carbs: (carbs / total) * 100,
    fats: (fats / total) * 100,
  };
}