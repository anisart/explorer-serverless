<template>
  <v-app light>
    <v-navigation-drawer fixed v-model="sideNav">
      <v-list>
        <v-list-tile 
          v-for="item in menuItems"
          :key="item.title"
          @click="menuItemClicked(item.action)">
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
      <v-toolbar-side-icon 
        light 
        @click.stop="sideNav = !sideNav" 
        class="hidden-sm-and-up">
      </v-toolbar-side-icon>
      <v-toolbar-title>Explorer</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          flat
          v-for="item in menuItems"
          :key="item.title"
          @click="menuItemClicked(item.action)">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <input 
      type="file"
      style="display: none"
      ref="fileInput"
      accept="text/xml text/gpx-xml text/gpx application/gpx-xml application/gpx"
      @change="filePicked">
    <app-explorer-zoom
      style="display: none"
      ref="explorerZoom">
    </app-explorer-zoom>
    <v-content fluid>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import togeojson from '@mapbox/togeojson'

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
    filePicked (event) {
      const files = event.target.files
      // let filename = files[0].name
      // if (filename.lastIndexOf('.') <= 0) {
      //   return alert('Please add a valid file!')
      // }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        const gpx = new DOMParser().parseFromString(fileReader.result, 'text/xml')
        this.$store.dispatch('setTrack', togeojson.gpx(gpx))
      })
      fileReader.readAsText(files[0], 'utf8')
    }
  }
}
</script>

<style>
html {
  overflow-y: auto;
}
</style>

