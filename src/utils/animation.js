import { Animation } from "photo-sphere-viewer";

const intro = ({ viewer, panorama }) => () => {
  //   return;
  new Animation({
    properties: {
      lat: { start: -1.1110848606132167, end: panorama.latitude },
      long: { start: 3.243473745745048, end: panorama.longitude },
      zoom: { start: 0, end: 10 },
      fisheye: { start: 2.2, end: 0 },
    },
    duration: 2000,
    easing: "inOutQuad",
    onTick: (properties) => {
      viewer.setOption("fisheye", properties.fisheye);
      viewer.rotate({
        longitude: properties.long,
        latitude: properties.lat,
      });
      viewer.zoom(properties.zoom);
    },
  });
};

export default intro;
