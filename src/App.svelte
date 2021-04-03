<script>
  import { onMount } from "svelte";
  import { Viewer, Animation } from "photo-sphere-viewer";
  import MarkersPlugin from "photo-sphere-viewer/dist/plugins/markers";
  import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
  import "photo-sphere-viewer/dist/plugins/markers.css";

  export let index = 0;
  let viewer;

  onMount(async () => {
    viewer = new Viewer({
      container: document.querySelector("#viewer"),
      panorama: "images/1-vchod.jpg",
      // defaultLat: 3,
      touchmoveTwoFingers: true,

      // defaultLat: -Math.PI / 2,
      // defaultLong: Math.PI,
      defaultZoomLvl: 0,
      fisheye: 4,
      navbar: ["zoom", "caption", "fullscreen"],
      plugins: [
        [
          MarkersPlugin,
          {
            markers: [
              {
                id: "new-marker",
                longitude: "45deg",
                latitude: "0deg",
                width: 32,
                height: 32,
                // data: document.getElementById("lorem-content").innerHTML,
                image: "assets/info.png",
                clickEventOnMarker: () => alert(JSON.stringify(data)),
              },
            ],
          },
        ],
      ],
    });

    const markersPlugin = viewer.getPlugin(MarkersPlugin);

    markersPlugin.on("select-marker", (e, marker) => {
      console.log(marker.$el, marker.data);
      const pos = marker.$el.getBoundingClientRect();
      console.log(pos);

      // markersPlugin.updateMarker({
      //   id: marker.id,
      //   image: "assets/pin-blue.png",
      // });
    });

    markersPlugin.on("unselect-marker", (marker) => {
      console.log("aaaaaa");
    });

    function intro() {
      new Animation({
        properties: {
          lat: { start: -Math.PI / 2, end: 0 },
          long: { start: Math.PI, end: 5 },
          zoom: { start: 0, end: 50 },
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
        console.log(data, `long:${data.longitude}, lat:${data.latitude}`);
    });
  });

  const nextPanorama = () => {
    index = (index + 1) % panoramaArray.length;
    viewer.setPanorama(panoramaArray[index]);
  };
  const prevPanorama = () => {
    if (index == 0) {
      index = panoramaArray.length - 1;
    } else {
      index = index - 1;
    }
    viewer.setPanorama(panoramaArray[index]);
  };
</script>

<div id="viewer" />
<div class="flex">
  <button class="prev control" on:click={prevPanorama}>&lt;</button>
  <button class="next control" on:click={nextPanorama}>&gt;</button>
</div>

<!-- <div id="lorem-content">
  <h1>Test</h1>

  <div>Blablablablalablaba abl bal blab lab lablabl alb</div>
</div> -->
<style>
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
    z-index: 100;
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
  .next {
    right: 0;
  }
  .prev {
    left: 0;
  }
</style>
