import { Shelter } from '../types';

/** シェルターのマーカー */
export class ShelterMarker extends google.maps.OverlayView {
  /** マーカーの要素 */
  private markerElement?: HTMLButtonElement;

  /**
   * @constructor
   * @param shelter シェルターデータ
   */
  constructor(public readonly shelter: Shelter, map: google.maps.Map) {
    super();

    this.setMap(map);
  }

  /** ライフサイクル */
  public onAdd(): void {
    this.markerElement = document.createElement('button');

    this.markerElement.classList.add('shelter-marker');
    this.markerElement.textContent = this.shelter.name;

    const panes = this.getPanes();

    panes.floatPane.appendChild(this.markerElement);
  }

  /** ライフサイクル */
  public draw(): void {
    if (!this.markerElement) {
      return;
    }

    const overlayProjection = this.getProjection();
    const position = overlayProjection.fromLatLngToDivPixel(
      new google.maps.LatLng(this.shelter.latitude, this.shelter.longitude)
    );

    this.markerElement.style.top = `${position.y}px`;
    this.markerElement.style.left = `${position.x}px`;
  }

  /**
   * 表示状態を設定する
   * @param isVisible trueでマーカーを表示
   */
  public setVisibility(isVisible: boolean): void {
    if (!this.markerElement) {
      return;
    }

    if (isVisible) {
      this.markerElement.classList.remove('-hidden');
    } else {
      this.markerElement.classList.add('-hidden');
    }
  }
}
