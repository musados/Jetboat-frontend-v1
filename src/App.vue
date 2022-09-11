<template>
  <v-app id="app" class="pa-0 ma-0" style="height:100%">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view class="pa-0 ma-0" style="height:100%"/>
  </v-app>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.fixed-streched{
  position:absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  z-index:0;
}
</style>
