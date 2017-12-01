<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-btn color="primary" dark slot="activator">Open Dialog</v-btn>
      <v-card>
        <v-card-title>Select explorer tile size</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="dialogValue" column>
            <v-radio label="4 km" value="12"></v-radio>
            <v-radio label="2 km" value="13"></v-radio>
            <v-radio label="1 km" value="14"></v-radio>
            <v-radio label="500 m" value="15"></v-radio>
            <v-radio label="250 m" value="16"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false
      }
    },
    computed: {
      dialogValue: {
        get () {
          return this.$store.state.explorerZoom
        },
        set (value) {
          this.$store.commit('setExplorerZoom', value)
        }
      }
    }
  }
</script>