<script>
  export let src = null;
</script>

<div class="image-popup" class:hidden={!src} on:click={() => (src = null)}>
  <img {src} on:click={() => (src = null)} alt="Detail značky" />
</div>

<style>
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
