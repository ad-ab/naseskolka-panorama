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
  let image;

  const loadMarkers = (pan) => {
    const photoId = pan.id;

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

  // Once we have data event
  $: if (panoramaArray && panoramaArray.length > 0) {
    const pan = panoramaArray[0];
    viewer = new Viewer({
      container: document.querySelector("#viewer"),
      panorama: `images/${pan.url}`,
      caption: pan.caption,

      defaultZoomLvl: 0,
      fisheye: 4,
      navbar: ["zoom", "caption", "fullscreen"],
      plugins: [[MarkersPlugin]],
    });

    function intro() {
      new Animation({
        properties: {
          lat: { start: -Math.PI / 2, end: pan.latitude },
          long: { start: 2 * Math.PI, end: pan.longitude },
          zoom: { start: 0, end: 10 },
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
      const { target, tooltipImg } = marker.config;
      marker.showTooltip(e);
      if (target) {
        index = panoramaArray.indexOf(
          panoramaArray.find((p) => p.id === target)
        );
      }
      if (tooltipImg) image = `images/${tooltipImg}`;
    });

    markersPlugin.on("unselect-marker", (marker) => {
      if (marker.hideTooltip) marker.hideTooltip();
    });
  }

  $: if (viewer && panoramaArray && panoramaArray.length > 0) {
    const pan = panoramaArray[index];
    console.log(index);

    // set panorama
    isLoading = true;
    markersPlugin.clearMarkers();
    if (pan) {
      viewer
        .setPanorama(`images/${pan.url}`, { ...pan, transition: 500 })
        .then(() => loadMarkers(pan))
        .finally(() => (isLoading = false));
      viewer.setOptions({ caption: pan.caption });
    }
  }

  onMount(async () => {
    // const { i } = queryString.parse(window.location.search);
    // if (i) index = i;

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

<div class="image-popup" class:hidden={!image} on:click={() => (image = null)}>
  <img src={image} on:click={() => (image = null)} alt="Detail značky" />
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
    justify-content: space-between;
    align-items: center;
  }
  .control {
    z-index: 200;
    background: black;
    color: white;
    font-weight: 700;
    opacity: 60%;
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
  .image-popup {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    padding: 5%;
    z-index: 200;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .image-popup img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }

  .hidden {
    display: none;
  }
</style>
