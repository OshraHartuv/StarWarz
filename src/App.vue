<template>
  <v-app>
    <v-layout>
      <v-app-bar
        title="StarWars"
        @click="$router.push('/')"
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


