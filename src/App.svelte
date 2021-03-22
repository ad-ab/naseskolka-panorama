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
      autoHideInfospot: false,
      onMouseWheel: (...a) => console.log(a),
    });

    for (let img of images) {
      let panorama = new PANOLENS.ImagePanorama(`images/${img}`);

      if (img === "image1.jpg") {
        const infospot = new PANOLENS.Infospot();
        infospot.position.set(3147.02, -776.99, -3798.26);
        infospot.addHoverText("Boby");
        infospot.addEventListener("click", () => alert("toto jsou boby"));
        panorama.add(infospot);
        console.log("infospot", infospot);
      }

      if (img === "image2.jpg") {
        const infospot = new PANOLENS.Infospot(100);
        infospot.position.set(2744.37, -223.03, -4161.0);
        infospot.addHoverText("Boby");
        infospot.addEventListener("click", () => alert("toto jsou boby"));
        panorama.add(infospot);
        console.log("infospot", infospot);
      }

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

<section class="background full"></section>

<div class="flex">
  <button class="prev control" on:click="{prevPanorama}">&lt;</button>
  <button class="next control" on:click="{nextPanorama}">&gt;</button>
</div>

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

  .flex {
    position: static;
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
    font-weight: 700;
    opacity: 60%;
    /* position: absolute; */
    bottom: 16px;
    font-size: 64px;
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
