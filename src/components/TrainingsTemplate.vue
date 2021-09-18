<template>
  <div class="trainings">
    <div class="main-container">
        <div class="row" style="height: 0px">
            <div class="col-md-9">
                <h2 style="float: left">List of Trainings:</h2>
            </div>
            <div class="col-md-3">
                <b-button variant="success" title="Add Training" style="float: right" v-b-modal="'definition-modal'" v-on:click="addTraining()"><font-awesome-icon icon="plus"/></b-button>
            </div>
          <div class="col-md-12">
            <b-card v-for="training in trainings" :key="training.id" bg-variant="info" text-variant="white" :header="training.name" class="text-center" style="margin-top: 10px">
                <b-card-text>
                    <div class="row">
                        <div class="col-md-6" style="font-weight: bold">
                            <div style="float: left">ID: {{training.id}}</div><br>
                            <div style="float: left">Description: {{training.description}}</div><br>
                            <div style="float: left">Created by: {{training.createdBy}}</div><br>
                            <div style="float: left">Created on: {{training.createdOn}}</div><br>
                            <div style="float: left">Exercises:
                                <b-button v-for="exercise in training.exerciseDefs" :key="exercise.id" variant="outline-light" class="tag">{{exercise.id}}: {{exercise.name}} <font-awesome-icon v-if="training.status !== 'active'" v-on:click="removeExerciseFromTraining(training, exercise)" icon="times"/></b-button>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="row">
                                <div class="col-md-12">
                                    <div style="float: right" v-if="training.status === 'ACTIVE'"><b-alert variant="info" show>Published</b-alert></div>
                                    <div style="float: right" v-if="training.status !== 'ACTIVE'"><b-alert variant="danger" show>Not Published</b-alert></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <b-button v-if="training.status !== 'ACTIVE'" title="Edit Training" style="float: right"
                                        v-b-modal="'definition-modal'" v-on:click="editTraining(training)"><font-awesome-icon icon="edit"/></b-button>
                                    <b-button v-if="training.status !== 'ACTIVE'" variant="danger" title="Delete Training" style="float: right"
                                        v-b-modal="'delete-modal'" v-on:click="deleteTraining(training)"><font-awesome-icon icon="trash"/></b-button>
                                    <b-button v-if="training.status !== 'ACTIVE'" variant="success" title="Publish Training" style="float: right"
                                        v-b-modal="'publish-modal'" v-on:click="publishTraining(training)"><font-awesome-icon icon="upload"/></b-button>
                                    <b-button v-if="training.status === 'ACTIVE'" title="Share Training" style="float: right"
                                        v-b-modal="'share-modal'" v-on:click="shareTraining(training)"><font-awesome-icon icon="share-square"/></b-button>
                                    <b-button v-if="training.status !== 'ACTIVE'" variant="success" title="Add Exercise To Training" style="float: right"
                                        v-b-modal="'add-child-modal'" v-on:click="addExerciseToTraining(training)"><font-awesome-icon icon="plus"/></b-button>
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
  name: 'TrainingsTemplate',
  props: {
    username: String,
    firstName: String,
    lastName: String
  },
  data: function () {
    return {
      training: '',
      modal: '',
      trainings: []
    }
  },
  methods: {
    async getTrainings () {
      fetch(this.$root.globalData.baseUrl + 'training/definition/' + this.$root.globalData.party.id, {
        method: 'GET'
      }).then(async response => {
        try {
          this.trainings = await response.json()
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    addTraining () {
      this.$emit('add-training-event')
    },
    editTraining (training) {
      this.$emit('edit-training-event', training)
    },
    deleteTraining (training) {
      this.$emit('delete-training-event', training)
    },
    publishTraining (training) {
      this.$emit('publish-training-event', training)
    },
    shareTraining (training) {
      this.$emit('share-training-event', training)
    },
    addExerciseToTraining (training) {
      this.$emit('add-exercise-event', training)
    },
    removeExerciseFromTraining (training, exercise) {
      fetch(this.$root.globalData.baseUrl + 'training/definition/exercise?trainingId=' + training.id + '&exerciseId=' + exercise.id, {
        method: 'DELETE'
      }).then(async response => {
        try {
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
            this.getTrainings()
          } else {
            throw (await response.json()).message
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    reloadTrainings () {
      this.getTrainings()
    }
  },
  async mounted () {
    await this.getTrainings()
  }
}
</script>

<style scoped>
.card {
    min-height: 22vh;
}
</style>
