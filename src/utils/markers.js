import MarkersPlugin from "photo-sphere-viewer/dist/plugins/markers";

let markersPlugin;

const load = ({ spots, panorama }) => {
  const photoId = panorama.id;

  const filteredSpots = spots
    .filter(({ photos }) => photos.find(({ id }) => id === photoId))
    .map((mark) => {
      const photo = mark.photos.find(({ id }) => id === photoId);
      return {
        width: 64,
        height: 64,
        scale: [0.5, 1],
        ...mark,
        tooltip: mark.description || mark.tooltip,
        image: `assets/${mark.img}`,
        latitude: photo.latitude,
        longitude: photo.longitude,
        className: "marker",
      };
    });

  markersPlugin.setMarkers(filteredSpots);
};

const onSelectMarker = (onSelect) => (e, marker) => {
  marker.showTooltip(e);
  onSelect(marker.config);
};

const onUnselectMarker = ({ hideTooltip }) => hideTooltip && hideTooltip();

const init = ({ viewer, onSelect }) => {
  markersPlugin = viewer.getPlugin(MarkersPlugin);

  markersPlugin.on("select-marker", onSelectMarker(onSelect));
  markersPlugin.on("unselect-marker", onUnselectMarker);
};

export const loadMarkers = load;
export const initMarkers = init;
export const clearMarkers = () => markersPlugin.clearMarkers();
