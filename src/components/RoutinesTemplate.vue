<template>
  <div class="routines">
    <div class="main-container">
        <div class="row" style="height: 0px">
            <div class="col-md-9">
                <h2 style="float: left">List of Routines:</h2>
            </div>
            <div class="col-md-3">
                <b-button variant="success" title="Add Routine" style="float: right" v-b-modal="'definition-modal'" v-on:click="addRoutine()"><font-awesome-icon icon="plus"/></b-button>
            </div>
          <div class="col-md-12">
            <b-card v-for="routine in routines" :key="routine.id" bg-variant="info" text-variant="white" :header="routine.name" class="text-center" style="margin-top: 10px">
                <b-card-text>
                    <div class="row">
                        <div class="col-md-9" style="font-weight: bold">
                            <div style="float: left">ID: {{routine.id}}</div><br>
                            <div style="float: left">Description: {{routine.description}}</div><br>
                            <div style="float: left">Created by: {{routine.createdBy}}</div><br>
                            <div style="float: left">Created on: {{routine.createdOn}}</div><br>
                            <div style="float: left">Trainings:
                                <b-button v-for="training in routine.trainingDefs" :key="training.day" variant="outline-light" class="tag">{{getDayName(training.dayOfWeek)}}: {{training.id}} <font-awesome-icon v-if="routine.status !== 'active'" v-on:click="removeTrainingFromRoutine(routine, training)" icon="times"/></b-button>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="row">
                                <div class="col-md-12">
                                    <div style="float: right" v-if="routine.status === 'ACTIVE'"><b-alert variant="info" show>Published</b-alert></div>
                                    <div style="float: right" v-if="routine.status !== 'ACTIVE'"><b-alert variant="danger" show>Not Published</b-alert></div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <b-button v-if="routine.status !== 'ACTIVE'" title="Edit Routine" style="float: right"
                                        v-b-modal="'definition-modal'" v-on:click="editRoutine(routine)"><font-awesome-icon icon="edit"/></b-button>
                                    <b-button v-if="routine.status !== 'ACTIVE'" variant="danger" title="Delete Routine" style="float: right"
                                        v-b-modal="'delete-modal'" v-on:click="deleteRoutine(routine)"><font-awesome-icon icon="trash"/></b-button>
                                    <b-button v-if="routine.status !== 'ACTIVE'" variant="success" title="Publish Routine" style="float: right"
                                        v-b-modal="'publish-modal'" v-on:click="publishRoutine(routine)"><font-awesome-icon icon="upload"/></b-button>
                                    <b-button v-if="routine.status === 'ACTIVE'" title="Share Routine" style="float: right"
                                        v-b-modal="'share-modal'" v-on:click="shareRoutine(routine)"><font-awesome-icon icon="share-square"/></b-button>
                                    <b-button v-if="routine.status !== 'ACTIVE'" variant="success" title="Add Training To Routine" style="float: right"
                                        v-b-modal="'add-child-modal'" v-on:click="addTrainingToRoutine(routine)"><font-awesome-icon icon="plus"/></b-button>
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
  name: 'RoutinesTemplate',
  props: {
    username: String,
    firstName: String,
    lastName: String
  },
  data: function () {
    return {
      routine: '',
      modal: '',
      routines: [
        {
          id: 100,
          name: 'Bench Press',
          status: 'active',
          description: 'text text text text text text text text text text text text text',
          createdBy: 'budimir_fodor@hotmail.com',
          createdOn: '09-05-2021',
          trainings: [{ day: 'Monday', id: 101 }, { day: 'Wednessday', id: 102 }, { day: 'Friday', id: 104 }]
        },
        {
          id: 101,
          name: 'Squat',
          status: 'inactive',
          description: 'text text text text text text text text text text text text text',
          createdBy: 'budimir_fodor@hotmail.com',
          createdOn: '09-05-2021',
          trainings: [{ day: 'Monday', id: 101 }, { day: 'Tuesday', id: 106 }, { day: 'Wednessday', id: 102 }, { day: 'Thursday', id: 108 }, { day: 'Friday', id: 104 }, { day: 'Saturday', id: 121 }, { day: 'Sunday', id: 111 }]
        },
        { id: 102, name: 'Pull up', status: 'inactive', description: 'text text text text text text text text text text text text text', createdBy: 'budimir_fodor@hotmail.com', createdOn: '09-05-2021' }
      ]
    }
  },
  methods: {
    async getRoutines () {
      fetch(this.$root.globalData.baseUrl + 'routine/definition/' + this.$root.globalData.party.id, {
        method: 'GET'
      }).then(async response => {
        try {
          this.routines = await response.json()
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    addRoutine () {
      this.$emit('add-routine-event')
    },
    editRoutine (routine) {
      this.$emit('edit-routine-event', routine)
    },
    deleteRoutine (routine) {
      this.$emit('delete-routine-event', routine)
    },
    publishRoutine (routine) {
      this.$emit('publish-routine-event', routine)
    },
    shareRoutine (routine) {
      this.$emit('share-routine-event', routine)
    },
    addTrainingToRoutine (routine) {
      this.$emit('add-training-event', routine)
    },
    getDayName (dayNumber) {
      switch (dayNumber) {
        case 0:
          return 'Monday'
        case 1:
          return 'Tuesday'
        case 2:
          return 'Wednessday'
        case 3:
          return 'Thursday'
        case 4:
          return 'Friday'
        case 5:
          return 'Saturday'
        default:
          return 'Sunday'
      }
    },
    removeTrainingFromRoutine (routine, training) {
      fetch(this.$root.globalData.baseUrl + 'routine/definition/training?routineId=' + routine.id +
        '&trainingId=' + training.id + '&dayOfWeek=' + training.dayOfWeek, {
        method: 'DELETE'
      }).then(async response => {
        try {
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
            this.getRoutines()
          } else {
            throw (await response.json()).message
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    reloadRoutines () {
      this.getRoutines()
    }
  },
  async mounted () {
    await this.getRoutines()
  }
}
</script>

<style scoped>
.card {
    min-height: 22vh;
}
</style>
