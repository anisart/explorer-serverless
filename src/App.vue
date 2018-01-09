<template>
  <v-app light>
    <v-navigation-drawer fixed v-model="sideNav">
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" @click="menuItemClicked(item.action)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar>
      <v-toolbar-side-icon light @click.stop="sideNav = !sideNav" class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <v-toolbar-title>Explorer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" @click="menuItemClicked(item.action)">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <input type="file" style="display: none" ref="fileInput" accept="text/xml text/gpx-xml text/gpx application/gpx-xml application/gpx" multiple @change="filePicked">
    <app-explorer-zoom style="display: none" ref="explorerZoom">
    </app-explorer-zoom>
    <v-content fluid>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import togeojson from '@mapbox/togeojson'
import JSZip from 'jszip'

export default {
  name: 'app',
  data () {
    return {
      sideNav: false,
      menuItems: [
        { title: 'Upload track', icon: 'file_upload', action: 'uploadFile' },
        { title: 'Explorer', icon: 'widgets', action: 'toggleExplorer' }
      ]
    }
  },
  methods: {
    menuItemClicked (action) {
      this.sideNav = false
      switch (action) {
        case 'uploadFile':
          this.$refs.fileInput.click()
          break
        case 'toggleExplorer':
          this.$refs.explorerZoom.dialog = true
          break
      }
    },
    readFile (file) {
      const gpx = new DOMParser().parseFromString(
            file,
            'text/xml'
          )
      let tracks = this.$store.getters.track
      const track = togeojson.gpx(gpx)
      if (tracks) {
        tracks.features = tracks.features.concat(track.features)
      } else {
        tracks = track
      }
      this.$store.dispatch('setTrack', tracks)
    },
    filePicked (event) {
      const files = event.target.files
      // let filename = files[0].name
      // if (filename.lastIndexOf('.') <= 0) {
      //   return alert('Please add a valid file!')
      // }
      Object.values(files).forEach(file => {
        if (file.name.split('.').pop() !== 'zip') {
          const fileReader = new FileReader()
          fileReader.onload = () => {
            this.readFile(fileReader.result)
          }
          fileReader.readAsText(file, 'utf8')
        } else {
          const self = this
          JSZip.loadAsync(file)
            .then(zip => {
              zip.forEach(function (relativePath, zipEntry) {
                zipEntry.async('string')
                .then(self.readFile)
                .catch(console.error)
              })
            })
            .catch(e => {
              console.log(file.name + ' : ' + e)
            })
        }
      })
    }
  }
}
</script>

<style>
html {
  overflow-y: auto;
}
</style>

