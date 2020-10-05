import { Shelter } from '../types';
import { noop } from './noop';

type MarkerHandler = (shelter: Shelter) => void;

/** シェルターのマーカー */
export class ShelterMarker extends google.maps.OverlayView {
  /** マーカーの要素 */
  private markerElement?: HTMLDivElement | null;

  /**
   * @constructor
   * @param shelter シェルターデータ
   */
  constructor(
    public readonly shelter: Shelter,
    map: google.maps.Map,
    private readonly onClick: MarkerHandler = noop
  ) {
    super();

    this.setMap(map);
  }

  /** ライフサイクル */
  public onAdd(): void {
    this.markerElement = document.createElement('div');

    this.markerElement.classList.add('shelter-marker');

    const button = document.createElement('button');

    button.classList.add('marker');

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      this.onClick(this.shelter);
    });

    this.markerElement.appendChild(button);

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

  /** アクティブなマーカーを設定する */
  public setActivation(flag: boolean): void {
    if (!this.markerElement) {
      return;
    }

    if (flag) {
      this.markerElement.classList.add('-active');
    } else {
      this.markerElement.classList.remove('-active');
    }
  }
}
