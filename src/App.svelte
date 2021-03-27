<script>
  import { onMount } from "svelte";
  import Panolens from "./Panolense.js";
  import { move } from "./images.js";
  import * as THREE from "three";

  let PANOLENS = Panolens.PANOLENS;

  export let images = [
    "image1.jpg",
    "image2.jpg",
    "image3.jpg",
    "image4.jpg",
    "image5.jpg",
    "image6.jpg",
    "image7.jpg",
  ];

  export let lookAt = [
    new THREE.Vector3(4968.66, -130.67, 499.97),
    new THREE.Vector3(4332.08, 132.5, 2484.72),
    new THREE.Vector3(3059.66, -90.62, 3942.74),
    new THREE.Vector3(-1289.41, 49.02, 4821.8),
    new THREE.Vector3(4963.68, -312.66, -458.7),
    new THREE.Vector3(4963.68, -312.66, -458.7),
    new THREE.Vector3(4963.68, -312.66, -458.7),
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
      autoRotate: true,
      autoRotateSpeed: 0.5,
      dampingFactor: 0.95,
      speedLimit: 5,
      autoRotateActivationDuration: 15000,
    });

    for (let [i, img] of images.entries()) {
      let panorama = new PANOLENS.ImagePanorama(`images/${img}`);
      panorama.animationDuration = 800;
      panorama.addEventListener("load", function () {
        viewer.tweenControlCenter(lookAt[i], 0);
      });

      if (img === "image1.jpg") {
        const infospot = new PANOLENS.Infospot(300);
        infospot.position.set(3147.02, -776.99, -3798.26);
        // infospot.addHoverText("Boby");
        // infospot.addEventListener("click", () => alert("toto jsou boby"));
        infospot.addHoverElement(
          document.getElementById("desc-container"),
          100
        );
        panorama.add(infospot);

        // Move spot
        const infospot2 = new PANOLENS.Infospot(200, move);
        infospot2.position.set(2356.02, -422.61, 4382.19);
        infospot2.addEventListener("click", () => {
          index = 1;
          viewer.setPanorama(panoramaArray[index]);
        });

        panorama.add(infospot2);
      }

      if (img === "image2.jpg") {
        const infospot = new PANOLENS.Infospot(100);
        infospot.position.set(2744.37, -223.03, -4161.0);
        // infospot.addHoverText("Boby");
        // infospot.addEventListener("click", () => alert("toto jsou boby"));
        infospot.addHoverElement(
          document.getElementById("desc-container"),
          100
        );
        panorama.add(infospot);

        // Move spot
        const infospot2 = new PANOLENS.Infospot(200, move);
        infospot2.position.set(1077.26, -395.62, -4864.3);
        infospot2.addEventListener("click", () => {
          index = 0;
          viewer.setPanorama(panoramaArray[index]);
        });
        panorama.add(infospot2);
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

<section class="background" />

<div class="flex">
  <button class="prev control" on:click={prevPanorama}>&lt;</button>
  <button class="next control" on:click={nextPanorama}>&gt;</button>
</div>

<div id="desc-container" style="display:none">
  <div class="title">Boby</div>
  <div class="text">
    Tyto boby se používaly v zimě na bobování z kopečku na druhém rohu zahrady.
  </div>
</div>

<style>
  section.background {
    position: absolute;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: -webkit-grab;
    cursor: grab;
  }

  #desc-container {
    width: 300px;
    color: black;
    background-color: white;
    padding: 16px;
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
