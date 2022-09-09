<template>
  <v-card height="100%" width="100%" class="pink mt-0 pa-0" flat>
    <v-toolbar app flat dense class="purple" style="z-index:1">
      <!-- <v-toolbar-title class="pink--text">{{sensorsData ? sensorsData.temperature.cpu : '---'}}</v-toolbar-title> -->
      <SensorsRow :sensors="sensorsData"/>
    </v-toolbar>

    <v-card-text class="fixed-streched ma-0 pa-0">
      <v-container fluid fill-height style="height:100% !important" class="ma-0 pa-0 yellow">
        <!-- <video ref="videoPlayer" :fullscreen="true" style="position:fixed; top:0;bottom:0; left:0; right:0;z-index:0 !important" class="video-js"></video> -->
        <v-row class="pink">{{BoatAddress}}</v-row>
        <v-row>
          <v-col cols="auto">
            <div>
              <p>Left:</p>
              <p>Speed: {{ leftSpeed }}</p>
              <p>Angle: {{ leftAngle }}</p>
              <p>X: {{ leftX }}</p>
              <p>Y: {{ leftY }}</p>
              <p>calX{{ leftXmin }}</p>
    
              <p>Gas: {{leftYValue}}</p>
    
              <p>Steering: {{leftXValue}}</p>
            </div>
          </v-col>
          <v-spacer />
    
          <v-col cols="auto">
            <div>
              <p>Right:</p>
              <p>Speed: {{ rightSpeed }}</p>
              <p>Angle: {{ rightAngle }}</p>
              <p>X: {{ rightX }}</p>
              <p>Y: {{ rightY }}</p>
            </div>
          </v-col>
          <v-col cols="auto"></v-col>
        </v-row>
        <Joystick
          style="position: fixed; bottom: 10px; left: 10px; z-index: 10 !important"
          border_color="grey"
          v-on:change="updateLeftStickData($event)"
        />
        <Joystick
          style="position: fixed; bottom: 10px; right: 10px"
          v-on:change="updateRightStickData($event)"
        />
      </v-container>
  </v-card-text>
  </v-card>
</template>

<script>
import Joystick from "./Joystick.vue";
import SensorsRow from './SensorsRow.vue'
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css'
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "MainControl",

  components: {
    Joystick,
    SensorsRow,
  },


  props: {
    options: {
      type: Object,
      default() {
        return {
          autoplay: true,
          controls: true,
          fullscreen: true,
          sources: [
            {
              src: "http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8",
              type: "application/x-mpegURL",
            },
          ],
        };
      },
    },
  },

  data: () => ({
    dataInterval: null,
    controlInterval:null,

    player: null,

    sensorsData:{},

    leftSpeed: 0,
    leftAngle: 0,
    leftX: 0,
    leftY: 0,
    leftYInvert:true,
    leftXInvert:false,
    leftXmax: localStorage.getItem("leftXmax"),
    leftXmin: localStorage.getItem("leftXmin"),
    leftYmax: localStorage.getItem("leftYmax"),
    leftYmin: localStorage.getItem("leftYmin"),

    rightSpeed: 0,
    rightAngle: 0,
    rightX: 0,
    rightY: 0,
    rightYInvert:true,
    rightXInvert:false,
    rightXmax: localStorage.getItem("rightXmax"),
    rightXmin: localStorage.getItem("rightXmin"),
    rightYmax: localStorage.getItem("rightYmax"),
    rightYmin: localStorage.getItem("rightYmin"),
  }),

  mounted() {
    // this.player = videojs(this.$refs.videoPlayer, this.options, () => {
    //   this.player.log('onPlayerReady', this);
    // });

    this.controlInterval = setInterval(() => {
      this.sendApiData();
    }, 100);

    this.dataInterval = setInterval(() => {
      this.getApiSensorsData();
    }, 1000);
    
    // if ([undefined, null].includes(this.leftXmin)) alert("need to calibrate!");
  },
  beforeDestroy() {
    if(this.dataInterval){
      clearInterval(this.dataInterval);
    }
    if(this.controlInterval){
      clearInterval(this.controlInterval);
    }
    if (this.player) {
      this.player.dispose();
    }
  },

  computed:{
    ...mapGetters({
      BoatAddress:'BoatAddress',
    }),

    leftXValue(){
      if(this.leftXInvert == true)
      return this.map(this.leftX, 86, -86, 1000,2000);
      return this.map(this.leftX, -86, 86, 1000,2000);
    },
    
    leftYValue(){
      if(this.leftYInvert == true)
      return this.map(this.leftY, 86, -86, 1000,2000)
      return this.map(this.leftY, -86, 86, 1000,2000);
    },

    rightXValue(){
      if(this.rightXInvert == true)
      return this.map(this.rightX, 86, -86, 1000,2000);
      return this.map(this.rightX, -86, 86, 1000,2000);
    },
    
    rightYValue(){
      if(this.rightYInvert == true)
      return this.map(this.rightY, 86, -86, 1000,2000)
      return this.map(this.rightY, -86, 86, 1000,2000);
    }
  },

  methods: {
    map(value, fromLow, fromHigh, toLow, toHigh) {
      return (
        ((toHigh - toLow) * (value - fromLow)) / (fromHigh - fromLow) + toLow
      );
    },

    updateLeftStickData(event) {
      this.leftSpeed = event.speed;
      this.leftAngle = event.angle;
      this.leftX = event.x;
      this.leftY = event.y;
    },

    updateRightStickData(event) {
      this.rightSpeed = event.speed;
      this.rightAngle = event.angle;
      this.rightX = event.x;
      this.rightY = event.y;
    },

    sendApiData() {
      let data = {
        throttle: this.leftYValue.toFixed(0),
        yaw: this.leftXValue.toFixed(0),
        pitch: this.rightYValue.toFixed(0),
        roll: this.rightXValue.toFixed(0),
        channels:[],
      }
      console.log(data)
      axios.post(`${this.BoatAddress}/control`, data);
    },

    getApiSensorsData(){
      axios.get(`${this.BoatAddress}/sensor`).then(res=>{
        if(res && res.data.success === true){
          this.sensorsData =  res.data.data;
        }
      }).catch(e=>{
        console.error(e);
      });
    },
  },
};
</script>
