<template>
  <v-app>
    <v-layout>
      <v-app-bar
        title="StarWarz"
        @click="moveToHomePage"
      ></v-app-bar>
      <v-main>
        <v-container>
          <RouterView />
          <notifications position="bottom right" />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script>
export default {
  methods:{
    moveToHomePage(){
      this.$router.push({name:'Home'})
    }
  }
}
</script>


