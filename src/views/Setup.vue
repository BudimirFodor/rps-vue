<template>
  <div class="setup">
    <div class="main-container" style="display: block">
        <b-card bg-variant="info" text-variant="white" header="Exercises" class="text-center" style="margin-bottom: 50px" v-on:click="reroute('exercises')">
            <div><font-awesome-icon icon="running" class="fa-5x"/></div>
            <b-card-text>Exercises are the core of the workout planner. They can be weigth lifting, duration, or distance oriented, and are divided into multiple exercise sets, which can be completed in a given training.</b-card-text>
        </b-card>
        <b-card bg-variant="info" text-variant="white" header="Trainings" class="text-center" style="margin-bottom: 50px" v-on:click="reroute('trainings')">
            <div><font-awesome-icon icon="dumbbell" class="fa-5x"/></div>
            <b-card-text>Trainings are a collection of exercises which can be completed and later viewed in order to track progress.</b-card-text>
        </b-card>
        <b-card bg-variant="info" text-variant="white" header="Routines" class="text-center" v-on:click="reroute('routines')">
            <div><font-awesome-icon icon="sync" class="fa-5x"/></div>
            <b-card-text>Routines are weekly distributions of a combination of different trainings.</b-card-text>
        </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetupTemplate',
  methods: {
    reroute (destination) {
      this.$router.push({ path: destination })
    }
  }
}
</script>

<style scoped>
.card {
    min-height: 20vh;
}
.card-body:hover {
    background-color: #0d99b5;
    cursor: pointer;
}
</style>
