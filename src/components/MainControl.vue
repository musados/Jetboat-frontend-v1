<template>
  <v-card max-height="100vh" width="100%" class="mt-0 pa-0" flat>
    <v-toolbar flat 
      dense 
      class="background" 
      style="border-bottom:1px solid lightblue;z-index:1" 
      height="48">
      <v-app-bar-nav-icon class="" @click.stop="drawer = !drawer">
      <template v-slot:default>
        <v-icon small>mdi-poll</v-icon>
      </template></v-app-bar-nav-icon>
      <v-toolbar-title class="primary--text px-0 mx-0">Jetboat</v-toolbar-title>
      <v-divider class="mx-3" vertical inset></v-divider>
      <v-spacer/>
      <SensorsRow :sensors="sensorsData"/>
    </v-toolbar>

    
    <v-card-text class="fixed-streched ma-0 mt-12 pa-0">
      <v-container fluid fill-height style="height:100% !important" class="ma-0 pa-0">
        <!-- <video ref="videoPlayer" :fullscreen="true" style="position:fixed; top:0;bottom:0; left:0; right:0;z-index:0 !important" class="video-js"></video> -->
        <v-row dense class="">
          <v-col cols="auto" class="mx-3">
            <!-- Water level progress  -->
            <label>Fluid: </label>
            <v-progress-circular
            v-if="sensorsData && sensorsData.water != null"
            label="ewerew"
            width="2"
            size="40"
            color="blue"
              rotate="90"
              v-model="sensorsData.water"
              >
              <template v-slot:default>
                {{sensorsData.water}}%
              </template>
            </v-progress-circular>
          </v-col>
          
          <v-spacer/>
        </v-row>
        <v-row>
          <v-col>
            <img :src="`${BoatAddress}/video`"/>
        <!-- <video style="position:fixed; top:0;bottom:0;right:0;left:0;max-height:100vh !important" width="1200" controls muted="muted">
            <source :src="`${BoatAddress}/video`"  />
        </video> -->
          </v-col>
        </v-row>
        <v-row dense >
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
          <v-col>{{sensorsData}}</v-col>
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
    <v-navigation-drawer
      dark
      absolute
      temporary
      bottom
      v-model="drawer"
    >
    <!-- <v-data-table v-if="sensorsData"
        :headers="temperaturesHeaders"
        :items="getTemperaturesItems"
        hide-default-footer>
        <template v-slot:[`item.icon`]="{item}">
          <v-icon>{{tempIcons[item.name]}}</v-icon>
        </template>
        <template v-slot:[`item.value`]="{item}">
          {{item.value? item.value.toFixed(1):'---'}}<span class="text-caption">c</span>
        </template>
      </v-data-table> -->


      <!-- <v-data-table v-if="sensorsData" dense
        :headers="[{value: 'icon', text: '#'},{value: 'name', text: 'Name'}, {value: 'temperature', text: 'Temperature'}]"
        :items="Object.values(sensorsData.temperature)">
          <template v-slot:[`item.icon`]="{item}">
            <v-icon>{{ tempIcons[item.name] }}</v-icon>
          </template> -->
    
          <!-- <v-list-item-content class=" px-0" style="max-width:fit-content !important">
            <v-list-item-title style="max-width:fit-content !important" class="green px-5">{{ item }}</v-list-item-title>
          </v-list-item-content>
    
          <v-list-item-content style="max-width:fit-content !important">
            <v-list-item-title style="max-width:fit-content !important">{{ sensorsData.temperature[item] ? sensorsData.temperature[item].toFixed(1) : '---' }}</v-list-item-title>
          </v-list-item-content> -->
      <!-- </v-data-table> -->
    
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
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

    drawer:false,

    player: null,

    sensorsData:{},
    tempIcons:{
      cpu:'mdi-cpu-64-bit',
      motor:'mdi-engine',
      boat:'mdi-ferry',
      raspberry:'mdi-laptop',
    },

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

    temperaturesHeaders(){
      return [
        {value: 'icon', text:'###', align:'center'},
        {value: 'name', text:'Sensor Name', align:'center'},
        {value: 'value', text:'Temperature', align:'center'},
      ]
    },

    getTemperaturesItems(){
      let result = [];
      if(this.sensorsData && this.sensorsData.temperature){
        for(let item in this.sensorsData.temperature){
          result.push({name: item, value: this.sensorsData.temperature[item]})
        }
      }

      return result;
    },

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

    async sendApiData() {
      let data = {
        throttle: this.leftYValue? this.leftYValue.toFixed(0): 0,
        yaw: this.leftXValue? this.leftXValue.toFixed(0): 0,
        pitch: this.rightYValue? this.rightYValue.toFixed(0): 0,
        roll: this.rightXValue?this.rightXValue.toFixed(0):0,
        channels:[],
      }
      // console.log(data)
      axios.post(`${this.BoatAddress}/control`, data);
    },

    async getApiSensorsData(){
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
