<script>
  import { onMount } from "svelte";

  export let images = [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    "image4.jpg",
    "image5.jpg",
    "image6.jpg",
    "image7.jpg",
  ];
  export let index = 0;
  const panoramaArray = [];

  let viewer;

  onMount(async () => {
    viewer = new PANOLENS.Viewer({
      controlBar: true,
      container: document.querySelector("section.background"),
      controlButtons: ["fullscreen"],
      output: "console",
    });

    for (let img of images) {
      let panorama = new PANOLENS.ImagePanorama(`images/${img}`);
      panoramaArray.push(panorama);
      viewer.add(panorama);
    }

    viewer.setPanorama(panoramaArray[index]);
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

<section class="background full" />

<button class="next control" on:click={nextPanorama}>&lt;</button>
<button class="prev control" on:click={prevPanorama}>&gt;</button>

<style>
  section.background {
    position: absolute;
    top: 0;
    left: 0;
    cursor: -webkit-grab;
    cursor: grab;
  }

  section.full {
    width: 100%;
    height: 100%;
  }

  .control {
    color: red;
    font-weight: 900;
    position: absolute;
    bottom: 40%;
    font-size: 64px;
    cursor: pointer;
    padding: 32px;
  }

  .next {
    right: 0;
  }
  .prev {
    left: 0;
  }
</style>
