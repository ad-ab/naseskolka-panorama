<script>
  import { onMount } from "svelte";
  import { Viewer } from "photo-sphere-viewer";
  import MarkersPlugin from "photo-sphere-viewer/dist/plugins/markers";

  import { loadMarkers, initMarkers, clearMarkers } from "./utils/markers.js";
  import intro from "./utils/animation.js";

  import ImagePopup from "./ImagePopup.svelte";

  import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
  import "photo-sphere-viewer/dist/plugins/markers.css";

  let index = 0;
  let panoramaArray = [];
  let spots = [];
  let isLoading = false;
  let image;

  let viewer;

  const initViewer = (panorama) => {
    viewer = new Viewer({
      container: document.querySelector("#viewer"),
      panorama: `images/${panorama.url}`,
      caption: panorama.caption,
      defaultZoomLvl: 0,
      fisheye: 2.2,
      navbar: ["zoom", "caption", "fullscreen"],
      plugins: [[MarkersPlugin]],
    });

    viewer.on("ready", intro({ viewer, panorama }));
    viewer.on("click", (e, data) => {
      data.rightclick &&
        console.log(`longitude:${data.longitude}, latitude:${data.latitude}`);
    });

    initMarkers({
      viewer,
      onSelect: ({ target, tooltipImg }) => {
        if (target) {
          index = panoramaArray.indexOf(
            panoramaArray.find((p) => p.id === target)
          );
        }
        if (tooltipImg) image = `images/${tooltipImg}`;
      },
    });
  };

  $: console.log(index);
  $: length = panoramaArray.length;
  $: panorama = panoramaArray[index];
  $: if (viewer) {
    // reloads when panorama changes
    isLoading = true;
    clearMarkers();

    viewer
      .setPanorama(`images/${panorama.url}`, { ...panorama, transition: 500 })
      .then(() => loadMarkers({ spots, panorama }))
      .finally(() => (isLoading = false));
    viewer.setOptions({ caption: panorama.caption });
  }

  onMount(async () => {
    // const { i } = queryString.parse(window.location.search);
    // if (i) index = i;

    Promise.all(
      [fetch("images.json"), fetch("imagespots.json")].map((p) =>
        p.then((response) => response.json())
      )
    ).then(([images, marks]) => {
      panoramaArray = images;
      spots = marks;

      initViewer(panoramaArray[0]);
    });
  });

  const next = () => (index = ++index % length);
  const prev = () => (index = (--index + length) % length);
</script>

<div id="viewer" />
<div class="flex">
  <button class="prev control" disabled={isLoading} on:click={prev}>
    &lt;
  </button>
  <button class="next control" disabled={isLoading} on:click={next}>
    &gt;
  </button>
</div>

<ImagePopup bind:src={image} />

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
</style>
