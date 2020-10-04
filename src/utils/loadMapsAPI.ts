/** Google Cloud PlatformのAPIキー */
export const { VITE_GCP_API_KEY } = import.meta.env;

/**
 * Google Maps APIのスクリプトを読み込む
 * @param callbackFnName 読み込みコールバック関数名
 */
export const loadMapsAPI = (callbackFnName: string): void => {
  const $script = document.createElement('script');

  $script.src = `https://maps.googleapis.com/maps/api/js?key=${VITE_GCP_API_KEY}&callback=${callbackFnName}`;
  $script.defer = true;

  document.head.appendChild($script);
}
