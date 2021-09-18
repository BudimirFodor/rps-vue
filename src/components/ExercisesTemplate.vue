<template>
  <div class="exercises">
    <div class="main-container">
        <div class="row" style="height: 0px">
            <div class="col-md-9">
                <h2 style="float: left">List of Exercises:</h2>
            </div>
            <div class="col-md-3">
                <b-button variant="success" title="Add Exercise" style="float: right" v-b-modal="'definition-modal'" v-on:click="addExercise()"><font-awesome-icon icon="plus"/></b-button>
            </div>
          <div class="col-md-12">
            <b-card v-for="exercise in exercises" :key="exercise.id" bg-variant="info" text-variant="white" :header="exercise.name" class="text-center" style="margin-top: 10px">
                <b-card-text>
                    <div class="row">
                        <div class="col-md-6" style="font-weight: bold">
                            <div style="float: left">ID: {{exercise.id}}</div><br>
                            <div style="float: left">Exercise Measurement Type: {{exercise.exerciseType}}</div><br>
                            <div style="float: left">Description: {{exercise.description}}</div><br>
                            <div style="float: left">Created by: {{exercise.createdBy}}</div><br>
                            <div style="float: left">Created on: {{exercise.createdOn}}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <div style="float: right" v-if="exercise.status === 'ACTIVE'"><b-alert variant="info" show>Published</b-alert></div>
                                    <div style="float: right" v-if="exercise.status !== 'ACTIVE'"><b-alert variant="danger" show>Not Published</b-alert></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <b-button v-if="exercise.status !== 'ACTIVE'" title="Edit Exercise" style="float: right"
                                        v-b-modal="'definition-modal'" v-on:click="editExercise(exercise)"><font-awesome-icon icon="edit"/></b-button>
                                    <b-button v-if="exercise.status !== 'ACTIVE'" variant="danger" title="Delete Exercise" style="float: right"
                                        v-b-modal="'delete-modal'" v-on:click="deleteExercise(exercise)"><font-awesome-icon icon="trash"/></b-button>
                                    <b-button v-if="exercise.status !== 'ACTIVE'" variant="success" title="Publish Exercise" style="float: right"
                                        v-b-modal="'publish-modal'" v-on:click="publishExercise(exercise)"><font-awesome-icon icon="upload"/></b-button>
                                    <b-button v-if="exercise.status === 'ACTIVE'" title="Share Exercise" style="float: right"
                                        v-b-modal="'share-modal'" v-on:click="shareExercise(exercise)"><font-awesome-icon icon="share-square"/></b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-card-text>
            </b-card>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExercisesTemplate',
  props: {
    username: String,
    firstName: String,
    lastName: String
  },
  data: function () {
    return {
      modal: '',
      exercises: []
    }
  },
  methods: {
    async getExercises () {
      fetch(this.$root.globalData.baseUrl + 'exercise/definition/' + this.$root.globalData.party.id, {
        method: 'GET'
      }).then(async response => {
        try {
          this.exercises = await response.json()
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    addExercise () {
      this.$emit('add-exercise-event')
    },
    editExercise (exercise) {
      this.$emit('edit-exercise-event', exercise)
    },
    deleteExercise (exercise) {
      this.$emit('delete-exercise-event', exercise)
    },
    publishExercise (exercise) {
      this.$emit('publish-exercise-event', exercise)
    },
    shareExercise (exercise) {
      this.$emit('share-exercise-event', exercise)
    },
    reloadExercises () {
      this.getExercises()
    }
  },
  async mounted () {
    await this.getExercises()
  }
}
</script>

<style scoped>
.card {
    min-height: 22vh;
}
</style>
