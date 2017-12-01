<template>
  <div id='map'>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import geojson from 'geojson'

export default {
  data () {
    return {
      map: null
    }
  },
  computed: {
    trackGeojson () {
      return this.$store.getters.track
    },
    explorerZoom () {
      return this.$store.state.explorerZoom
    }
  },
  watch: {
    trackGeojson () {
      this.map.getSource('track').setData(this.trackGeojson)
      this.fillExplorerLayer()
    },
    explorerZoom () {
      this.fillExplorerLayer()
    }
  },
  methods: {
    createMap () {
      mapboxgl.accessToken =
        'pk.eyJ1IjoiYW5pc2FydCIsImEiOiJjajluM3Z4YWgyNThjMzJtdmdlYTR4dG02In0.W1X35NjVBiwithy3SaUo8g'

      // init the map
      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [43.8052, 56.2777],
        zoom: 9,
        maxZoom: 20,
        minZoom: 1
      })

      this.map.addControl(new mapboxgl.NavigationControl())

      this.map.on('load', this.mapLoaded)
    },
    mapLoaded () {
      this.map.addSource('track', {
        type: 'geojson',
        data: this.trackGeojson
      })

      this.map.addLayer({
        id: 'track',
        type: 'line',
        source: 'track',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#f00',
          'line-width': 2
        }
      })

      this.map.addSource('explorer', {
        type: 'geojson',
        data: null
      })

      this.map.addLayer({
        id: 'explorer',
        type: 'fill',
        source: 'explorer',
        paint: {
          'fill-color': '#0f0',
          'fill-opacity': 0.3
        }
      })
    },
    fillExplorerLayer () {
      if (this.trackGeojson === null) return
      let points = []
      this.trackGeojson.features.forEach(feature => { points = points.concat(feature.geometry.coordinates) })
      this.map.getSource('explorer').setData(this.getTiles(points, Number(this.explorerZoom)))
    },
    getTiles (points, zoom) {
      const allTiles = []
      points.forEach(point => {
        const x = lon2tile(point[0], zoom)
        const y = lat2tile(point[1], zoom)
        allTiles.push({ x: x, y: y })
      })
      const exists = {}
      const polygons = []
      for (let tile of allTiles) {
        const key = `${tile.x}-${tile.y}`
        if (exists[key]) {
          continue
        }
        exists[key] = true
        const bbox = tile2bbox(tile.x, tile.y, zoom)
        const polygon = {
          polygon: [
            [
              [bbox.west, bbox.north],
              [bbox.east, bbox.north],
              [bbox.east, bbox.south],
              [bbox.west, bbox.south],
              [bbox.west, bbox.north]
            ]
          ]
        }
        polygons.push(polygon)
      }
      return geojson.parse(polygons, { Polygon: 'polygon' })
    }
  },
  mounted () {
    this.createMap()
  }
}

function lon2tile (lon, zoom) {
  return Math.floor((lon + 180) / 360 * Math.pow(2, zoom))
}

function lat2tile (lat, zoom) {
  return Math.floor(
    (1 -
      Math.log(
        Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)
      ) /
      Math.PI) /
    2 *
    Math.pow(2, zoom)
  )
}

function tile2lon (x, zoom) {
  return x / Math.pow(2, zoom) * 360 - 180
}

function tile2lat (y, zoom) {
  const n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom)
  return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}

function tile2bbox (x, y, zoom) {
  const north = tile2lat(y, zoom)
  const south = tile2lat(y + 1, zoom)
  const west = tile2lon(x, zoom)
  const east = tile2lon(x + 1, zoom)
  return { north: north, south: south, west: west, east: east }
}
</script>

<style scoped>
/* body {
  margin: 0;
  padding: 0;
} */

#map {
  /* position: relative;
  top: 0;
  bottom: 0;
  width: 100%; */
  height: 100%;
}
</style>