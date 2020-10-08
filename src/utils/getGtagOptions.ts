import { Options } from 'vue-gtag-next';

/**
 * gtagプラグインのオプションを返す
 */
export const getGtagOptions = (): Options => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  console.log(measurementId);

  if (typeof measurementId !== 'string') {
    return {
      isEnabled: false,
    };
  }

  return {
    isEnabled: true,
    property: {
      id: measurementId,
    },
  };
};
