import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import router from './router'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader


Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

Vue.mixin({
  mounted() {
    //console.log("hello world from mixin!!!");
  },

  methods: {
    
    getInProduction(){
      return process.env.NODE_ENV === 'production';
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text);

      /* Alert the copied text */
      store.commit("showSnackbar", {
        txt: `Text has been copied`,
        color: "information",
      });
    },

    objectFromJsonString(js) {
      return JSON.parse(JSON.parse(JSON.stringify(js).replace(/(?:\\[rn])+/g, '')))
    },

    timestampToString(tstamp, offset = 0) {
      let result = "---";
      if (tstamp != null) {

        let locals = "he-IL";
        // let options = { dateStyle: "full"/*, timeZone: 'UTC', timeZoneName : 'short'*/, hour12: false };
        let dt = new Date(Date.parse(tstamp));
        dt.setHours(dt.getHours() + offset);
        let dt_str = dt.toLocaleString(locals//,
          // options
        );
        result = dt_str;//String(tstamp).replace("T", " ");
        // if (result.includes(".")) {
        //   result = result.substring(0, result.indexOf("."));
        // }
      }
      return result;
    },

    millisToTimeString(ms) {
      let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
      ms = ms % (1000 * 60 * 60 * 24);
      let hours = (ms / (1000 * 60 * 60)).toFixed(0);
      ms %= (1000 * 60 * 60);
      let minutes = (ms / (1000 * 60)).toFixed(0);
      ms %= (1000 * 60);
      let seconds = (ms / 1000).toFixed(0);

      return (days > 0 ? `${days} days ` : '') + (hours > 0 ? `${hours} hours ` : '') + (minutes > 0 ? `${minutes} minutes ` : '') + `${seconds} seconds (in milliseconds)`
    },

    secondsToTimeString(sec) {
      let days = parseInt(sec / (60 * 60 * 24)).toFixed(0);
      sec = sec % (60 * 60 * 24);
      let hours = parseInt(sec / (60 * 60)).toFixed(0);
      sec %= (1 * 60 * 60);
      let minutes = parseInt(sec / (60)).toFixed(0);
      sec %= 1 * 60;
      let seconds = parseInt(sec).toFixed(0);

      return (days > 0 ? `${days} days ` : '') + (hours > 0 ? `${hours} hours ` : '') + (minutes > 0 ? `${minutes} minutes ` : '') + `${seconds} seconds (in seconds)`
    },

    refreshPage() {
      window.location.reload();
    },

    getDateSTRING(date_num, deliter) {
      var today = new Date(date_num);
      var dd = today.getDate();

      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }

      if (mm < 10) {
        mm = '0' + mm;
      }

      today = dd + deliter + mm + deliter + yyyy;
      console.log(today);
      return today;
    },
  }
});