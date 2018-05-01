<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" scrollable max-width="400px">
      <v-btn color="primary" dark slot="activator">Open Dialog</v-btn>
      <v-card>
        <v-card-title class="headline">
          Input explorer tiles strings
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <div>
            Output of <pre>JSON.stringify(Object.keys(window.explorerTiles))</pre> on VV Activities page.
          </div>
          <v-text-field
            label="First user tiles"
            hint='["10216-5093","10216-5092",...,"10217-5093"]'
            persistent-hint="true"
            v-model="firstTiles"
            :rules="[rules.required, rules.json]"
            required>
          </v-text-field>
          <v-text-field
            label="Second user tiles"
            hint='["10216-5093","10216-5092",...,"10217-5093"]'
            persistent-hint="true"
            v-model="secondTiles"
            :rules="[rules.required, rules.json]"
            required>
          </v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            flat
            @click.native="dialog = false">
              Close
            </v-btn>
          <v-btn
            color="blue darken-1"
            flat
            :loading="loading"
            @click.native="compareClicked"
            :disabled="loading || invalidFields">
              Compare
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      loader: null,
      loading: false,
      firstTiles: '',
      secondTiles: '',
      rules: {
        required: (value) => !!value || 'Required.',
        json: (value) => isJsonArray(value) || 'Invalid JSON array'
      }
    }
  },
  computed: {
    invalidFields () {
      return !isJsonArray(this.firstTiles) || !isJsonArray(this.secondTiles)
    }
  },
  methods: {
    compareClicked () {
      this.loading = true
      this.$store.commit('setFirstTiles', getTiles(this.firstTiles))
      this.$store.commit('setSecondTiles', getTiles(this.secondTiles))
      this.loading = false
      this.dialog = false
    }
  }
}

function getTiles (vvTiles) {
  const tiles = JSON.parse(vvTiles)
  let parsedTiles = []
  tiles.forEach(element => {
    let xy = element.split('-')
    parsedTiles.push({ x: Number(xy[0]), y: Number(xy[1]) })
  })
  return parsedTiles
}

function isJsonArray (str) {
  try {
    if (JSON.parse(str) instanceof Array) {
      return true
    }
  } catch (e) {
  }
  return false
}
</script>