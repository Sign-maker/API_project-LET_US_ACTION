export const yearMonthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
export const dateUTCRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export const minWaterCount = 1;
export const maxWaterCount = 5000;
export const maxDailyWaterCount = 15000;
export const waterLimits = {
  MIN_ONE_TIME_WATER_VALUE: 1,
  MAX_ONE_TIME_WATER_VALUE: 5000,
  MAX_DAILY_WATER_VALUE: 15000,
};
