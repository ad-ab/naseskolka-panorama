<script>
  import { onMount } from "svelte";
  import { Viewer, Animation } from "photo-sphere-viewer";
  import MarkersPlugin from "photo-sphere-viewer/dist/plugins/markers";
  import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
  import "photo-sphere-viewer/dist/plugins/markers.css";

  export let index = 0;
  let panoramaArray = [];
  let spots = [];
  let viewer;
  let isLoading = false;
  let markersPlugin;

  const loadMarkers = (pan) => {
    const photoId = pan.id;

    const filteredSpots = spots
      .filter(({ photos }) => photos.find(({ id }) => id === photoId))
      .map((mark) => {
        const photo = mark.photos.find(({ id }) => id === photoId);
        return {
          tooltip: mark.description,
          width: 64,
          height: 64,
          scale: [0.5, 1],
          ...mark,
          image: `assets/${mark.img}`,
          latitude: photo.latitude,
          longitude: photo.longitude,
        };
      });

    markersPlugin.setMarkers(filteredSpots);
  };

  // Once we have data event
  $: if (panoramaArray && panoramaArray.length > 0) {
    const pan = panoramaArray[0];
    viewer = new Viewer({
      container: document.querySelector("#viewer"),
      panorama: `images/${pan.url}`,
      caption: pan.caption,
      touchmoveTwoFingers: true,

      defaultZoomLvl: 0,
      fisheye: 4,
      navbar: ["zoom", "caption", "fullscreen"],
      plugins: [[MarkersPlugin]],
    });

    function intro() {
      new Animation({
        properties: {
          lat: { start: -Math.PI / 2, end: pan.latitude },
          long: { start: Math.PI, end: pan.longitude },
          zoom: { start: 0, end: 30 },
          fisheye: { start: 2, end: 0 },
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
    }

    viewer.on("ready", intro);
    viewer.on("click", (e, data) => {
      data.rightclick &&
        console.log(`longitude:${data.longitude}, latitude:${data.latitude}`);
    });

    markersPlugin = viewer.getPlugin(MarkersPlugin);

    markersPlugin.on("select-marker", (e, marker) => {
      const { target } = marker.config;
      if (target) {
        index = panoramaArray.indexOf(
          panoramaArray.find((p) => p.id === target)
        );
      }
    });

    markersPlugin.on("unselect-marker", (marker) => {});
  }

  $: if (viewer && panoramaArray && panoramaArray.length > 0) {
    const pan = panoramaArray[index];

    // set panorama
    isLoading = true;
    markersPlugin.clearMarkers();
    if (pan) {
      console.log("setpanroam", pan);
      viewer
        .setPanorama(`images/${pan.url}`, { ...pan, transition: 500 })
        .then(() => loadMarkers(pan))
        .finally(() => (isLoading = false));
      viewer.setOptions({ caption: pan.caption });
    }
  }

  onMount(async () => {
    fetch("images.json")
      .then((response) => response.json())
      .then((data) => {
        panoramaArray = data;
      });
    fetch("imagespots.json")
      .then((response) => response.json())
      .then((data) => {
        spots = data;
      });
  });

  const nextPanorama = () => {
    index = ++index % panoramaArray.length;
  };
  const prevPanorama = () => {
    index = (--index + panoramaArray.length) % panoramaArray.length;
    console.log(index);
  };
</script>

<div id="viewer" />
<div class="flex">
  <button class="prev control" disabled={isLoading} on:click={prevPanorama}
    >&lt;</button
  >
  <button class="next control" disabled={isLoading} on:click={nextPanorama}
    >&gt;</button
  >
</div>

<style>
  :global(.psv-tooltip) {
    max-width: 600px !important;
  }

  /* the viewer container must have a defined size */
  #viewer {
    width: 100%;
    height: 100%;
  }

  .flex {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    /* flex-direction: column; */
    justify-content: space-between;
    /* justify-items: center; */
    align-items: center;
  }
  .control {
    z-index: 200;
    background: black;
    color: white;
    font-weight: 700;
    opacity: 60%;
    /* position: absolute; */
    bottom: 16px;
    font-size: 32px;
    cursor: pointer;
    padding: 16px;
    transition: opacity 0.3s;
  }

  .control:hover {
    opacity: 85%;
  }
  .control:disabled {
    cursor: wait;
  }
  .next {
    right: 0;
  }
  .prev {
    left: 0;
  }
</style>
