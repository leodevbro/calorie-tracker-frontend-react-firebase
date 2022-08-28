const constantNums = {
  dailyCalorieLimit: 2100,
};

export const getConstant = (name: keyof typeof constantNums): number => constantNums[name];
