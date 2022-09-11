<template>
  <v-row dense class="text-capitalize">
    <v-col cols="auto" class="my-auto"></v-col>
    <v-col cols="auto" class="my-auto"></v-col>
    <v-spacer />
    <v-col cols="auto" class="my-auto" :class="`${staelliteColor}--text`">
      <span class="my-auto font-weight-bold">
        {{ satellitesNum }}
      </span>
    </v-col>
    <v-col cols="auto" class="my-auto">
      <v-icon :color="staelliteColor" style="transform: rotate(90deg)"
        >mdi-satellite-variant</v-icon
      >
    </v-col>

    <!-- Battery  -->
    <v-col cols="auto" class="my-auto mx-0">
      <span class="my-auto font-weight-bold"> {{ batteryPercentage }}% </span>
    </v-col>
    <v-col cols="auto">
      <v-icon large :color="batteryColor" style="transform: rotate(-90deg)">{{
        batteryIcon
      }}</v-icon>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "dataRow",

  props: {
    sensors: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
      batteryMap: {
        0: "mdi-battery-outline",
        10: "mdi-battery-10",
        20: "mdi-battery-20",
        30: "mdi-battery-30",
        40: "mdi-battery-40",
        50: "mdi-battery-50",
        60: "mdi-battery-60",
        70: "mdi-battery-70",
        80: "mdi-battery-80",
        90: "mdi-battery-90",
        100: "mdi-battery",
      },
    };
  },

  methods: {
    getTemperature(temp) {
      if (temp == null) return "---";
      return temp.toFixed(1);
    },
  },

  computed: {
    batteryPercentage() {
      let result = 0;
      if (
        this.sensors &&
        this.sensors.battery &&
        this.sensors.battery.percent
      ) {
        result = Number(this.sensors.battery.percent);
      }

      return result;
    },

    batteryIcon() {
      let result = Math.ceil(this.batteryPercentage);
      return this.batteryMap[result];
    },

    batteryColor() {
      let result = "error";
      if (
        this.sensors &&
        this.sensors.battery &&
        this.sensors.battery.percent
      ) {
        if (this.sensors.battery.percent > 50) result = "success";
        else if (this.sensors.battery.percent > 30) result = "warning";
        else result = "error";
      }

      return result;
    },

    satellitesNum() {
      let result = "---";
      if (this.sensors && this.sensors.gps) {
        if (this.sensors.gps.sats != null) {
          result = Number(this.sensors.gps.sats);
        }
      }
      return result;
    },

    staelliteColor() {
      let result = "black";
      if (this.sensors && this.sensors.gps) {
        if (this.sensors.gps.fix) {
          result = "success";
        }
      }

      return result;
    },
  },
};
</script>