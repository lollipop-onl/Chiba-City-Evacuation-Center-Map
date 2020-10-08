/* eslint-disable prefer-rest-params */

/**
 * GoogleAnalyticsのスクリプトを読み込む
 * @param measurementId 測定ID
 */
export const loadGoogleAnalyticsScript = (measurementId?: string): void => {
  if (!measurementId) {
    return;
  }

  const $script = document.createElement('script');

  $script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  $script.async = true;

  document.head.appendChild($script);

  // @ts-expect-error
  window.dataLayer = window.dataLayer || [];
  // @ts-expect-error
  function gtag(){dataLayer.push(arguments);}
  // @ts-expect-error
  gtag('js', new Date());

  // @ts-expect-error
  gtag('config', measurementId);
};
