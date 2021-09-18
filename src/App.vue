<template>
  <div id="app">
    <div id="nav" class="row">
      <div class="col-md-2 navbar-title">
        <font-awesome-icon icon="dumbbell"/> Workout Planner
      </div>
      <div class="col-md-10 navbar-body">
        <div class="row">
          <div class="col-md-1 offset-md-5 navbar-item">
            <router-link to="/"><font-awesome-icon icon="home"/> Home</router-link>
          </div>
          <div class="col-md-1 navbar-item">
            <router-link to="/calendar"><font-awesome-icon icon="calendar"/> Calendar</router-link>
          </div>
          <div class="col-md-1 navbar-item">
            <router-link to="/setup"><font-awesome-icon icon="cogs"/> Setup</router-link>
          </div>
          <div class="col-md-1 navbar-item">
            <router-link to="/exercises"><font-awesome-icon icon="running"/> Exercises</router-link>
          </div>
          <div class="col-md-1 navbar-item">
            <router-link to="/trainings"><font-awesome-icon icon="dumbbell"/> Trainings</router-link>
          </div>
          <div class="col-md-1 navbar-item">
            <router-link to="/routines"><font-awesome-icon icon="sync"/> Routines</router-link>
          </div>
          <div class="col-md-1 navbar-item">
            <router-link to="/logout"><font-awesome-icon icon="sign-out-alt"/> Logout</router-link>
          </div>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
