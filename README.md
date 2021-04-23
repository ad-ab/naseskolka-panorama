# Virtual Tour

## Get started

```bash
npm install
```

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000).

## Configuration

### Panoramas

`/public/images.json` contains a list of images that will displayed:

```json
[
  {
    "id": "[PanoramaId]",
    "url": "[Filename].jpg",
    "longitude": 5.4182361795260725,
    "latitude": 0.21242258284960358,
    "caption": "[Description]"
  }
]
```

You can get the latitude and longitude in the UI by right clicking when the image is loaded. The point you get will be used as the center when the image is loaded.

### Information points

`/public/imagespots.json`

```json
[
  {
    "id": "[InfospotId]",
    "target": "[PanoramaId]",
    "tooltip": "[Description]",
    "img": "[info/next].png",
    "photos": [
      {
        "id": "[PanoramaId1]",
        "longitude": 1.5528111104951692,
        "latitude": -0.08365812467026101
      },
      {
        "id": "[PanoramaId2]",
        "longitude": 1.674474482715747,
        "latitude": -0.08223691150187085
      },
      {
        "id": "[PanoramaId3]",
        "longitude": 1.5792816099306122,
        "latitude": -0.07529008665369785
      },
      {
        "id": "[PanoramaId4]",
        "longitude": 1.3883746952621951,
        "latitude": -0.20712408566075657
      }
    ]
  }
]
```

You need to create an infopoint. It can be a point that will move you to the [target] panorama or it can be a tooltip that displays in image [tooltipImg].

You need to set the Panoramas and the infospots location on that panorama in the [photos] parameter.
