<template>
    <v-row dense class="text-capitalize">
        <v-col cols="auto">
            <span >CPU:</span><span class="font-weight-bold">{{getTemperature(sensors.temperature.cpu)}}</span>
        </v-col>
        <v-col cols="auto">
            <span >Boat:</span><span class="font-weight-bold">{{getTemperature(sensors.temperature.boat)}}</span>
        </v-col>
        <v-col cols="auto">
            <span >Raspberry:</span><span class="font-weight-bold">{{getTemperature(sensors.temperature.raspberry)}}</span>
        </v-col>
        <v-col cols="auto"></v-col>
        <v-col cols="auto"></v-col>
        <v-col cols="auto"></v-col>
        <v-spacer/>
    </v-row>
</template>

<script>
    export default{
        name: 'data row',

        props:{
            sensors:{
                type: Object,
                require: true
            }
        },

        methods:{
            getTemperature(temp){
                if (temp == null) return '---'
                return temp.toFixed(1)
            }
        },
    }
</script>