<template>
  <div class="calendar">
      <div class="row">
          <div class="col-md-8">
                <div class="row">
                    <h2 style="float: left">Workout Calendar</h2>
                </div>
                <div class="row">
                    <div class="col-md-2">
                      Routine:
                    </div>
                    <div class="col-md-9">
                      <b-form-select v-model="selectedRoutine" :options="routines" value-field="id" text-field="name" v-on:change="setRoutine()"></b-form-select>
                    </div>
                    <div class="col-md-1">
                      <b-button style="float: right" variant="success" title="Subscribe to a new routine"
                                        v-b-modal="'subscribe-modal'" v-on:click="openSubscribeModal"><font-awesome-icon icon="plus"/></b-button>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <h2 style="float: left">Training Details:</h2>
            </div>
      </div>
      <div v-if="routine" class="row">
            <div class="col-md-8">
                <b-calendar block locale="en-UK" v-model="selectedTraining" start-weekday="1" :date-info-fn="dateClass" :date-disabled-fn="dateDisable" v-on:context="changeContext"></b-calendar>
                <div class="row" style="padding-top: 20px">
                    <div class="col-md-2">
                        <b-button size="lg" variant="danger" v-if="selectedTraining" v-on:click="clearDate"><font-awesome-icon icon="times"/> Clear date</b-button>
                    </div>
                    <div class="col-md-2 offset-md-8">
                        <b-button size="lg" v-on:click="setToday" ><font-awesome-icon icon="clock"/> Set Today</b-button>
                    </div>
                </div>
            </div>
            <div class="col-md-4" style="padding-top: 10px">
                <div v-if="detailsType==='none'" class="note">
                    Please select a training in order to view more details.
                </div>
                <div v-else-if="detailsType==='create'">
                    <b-button variant="success" title="Creates a new training from the given preset for today" v-on:click="startTraining"><font-awesome-icon icon="play"/> Start Training</b-button>
                </div>
                <div v-else-if="detailsType==='available'" class="note">
                    A future training can be completed on this day of the week.
                </div>
                <div v-else>
                    <b-card bg-variant="info" :header="training.name + ' (' + activeYMD + ')'" class="text-center details-card">
                        <b-card-text>
                            <div v-if="!training.finishedOn" class ="row">
                                <div class="col-md-12">
                                    <b-button id="complete-training" variant="success" title="Finish the training" v-on:click="completeTraining"><font-awesome-icon icon="check"/> Complete Training</b-button>
                                </div>
                            </div>
                            <div class="note">{{training.description}}</div>
                            <b-card v-for="exercise in exercises" :key="exercise.id" bg-variant="light" text-variant="black" class="text-center">
                                <template #header>
                                    {{exercise.name}}
                                    <b-button v-if="!training.finishedOn" size="sm" style="float: right" variant="success" title="Add set"
                                        v-b-modal="'set-modal'" v-on:click="addSet(exercise)"><font-awesome-icon icon="plus"/></b-button>
                                </template>
                                <b-card-text>
                                    <div v-for="(set, index) in exercise.exerciseSets" :key="set.id" class="row" style="padding-bottom: 5px">
                                        <div class="col-md-1">{{index + 1}})</div>
                                        <div class="col-md-4">Number of Reps: {{set.numberOfReps}}</div>
                                        <div v-if="exercise.exerciseType === 'WEIGHT'" class="col-md-5">
                                            Weight: {{set.weightValue}} kg
                                        </div>
                                        <div v-else-if="exercise.exerciseType === 'DISTANCE'" class="col-md-5">
                                            Distance: {{set.distValue}} km
                                        </div>
                                        <div v-else class="col-md-5">
                                            Duration: {{set.timeValue}} min
                                        </div>
                                        <div v-if="!training.finishedOn" class="col-md-2">
                                          <b-button id="delete-set" size="sm" variant="danger" title="Delete set" style="float: right;"
                                            v-on:click="deleteSet(set)"><font-awesome-icon icon="trash"/></b-button>
                                        </div>
                                    </div>
                                    <div v-if="exercise.exerciseSets && exercise.exerciseSets.length === 0" class="note black">
                                        There are no sets for this exercise.
                                    </div>
                                </b-card-text>
                            </b-card>
                        </b-card-text>
                    </b-card>
                </div>
            </div>
      </div>
      <div v-else>
          <div class="note big-note">Please select a routine in order to view the calendar.</div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarTemplate',
  data: function () {
    return {
      currentMonth: null,
      currentYear: null,
      activeYMD: null,
      today: this.getTodayDate(),
      detailsType: 'none',
      routine: { id: 100, name: 'Test Routine', days: [1, 2, 3, 4, 6] },
      selectedRoutine: null,
      selectedTraining: null,
      fromDateParam: '',
      toDateParam: '',
      routines: [],
      trainings: [],
      exercises: [],
      training: null
    }
  },
  methods: {
    async getRoutines () {
      fetch(this.$root.globalData.baseUrl + 'routine/all/' + this.$root.globalData.party.id, {
        method: 'GET'
      }).then(async response => {
        try {
          this.routines = [{ id: null, name: 'Select a routine', disabled: true }]
          this.selectedRoutine = null
          this.routine = null
          const routinesResponse = await response.json()
          for (let i = 0; i < routinesResponse.length; i++) {
            this.routines.push(routinesResponse[i])
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    getTrainings () {
      fetch(this.$root.globalData.baseUrl + 'training/all/' + this.routine.id + '?dateFrom=' + this.fromDateParam + '&dateTo=' + this.toDateParam, {
        method: 'GET'
      }).then(async response => {
        try {
          this.trainings = await response.json()
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    getExercises () {
      fetch(this.$root.globalData.baseUrl + 'exercise/' + this.training.id, {
        method: 'GET'
      }).then(async response => {
        try {
          this.exercises = await response.json()
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    setRoutine () {
      for (let i = 1; i < this.routines.length; i++) {
        if (this.routines[i].id === this.selectedRoutine) {
          this.routine = this.routines[i]
        }
      }
      this.routine.days = []
      for (let i = 0; i < this.routine.trainingDefs.length; i++) {
        this.routine.days.push(this.routine.trainingDefs[i].dayOfWeek)
      }
      this.getTrainings()
    },
    dateClass (ymd, date) {
      if (ymd >= this.today) {
        if (this.routine.days.indexOf((date.getDay() + 6) % 7) !== -1) {
          if (ymd !== this.today) {
            return 'table-available'
          } else {
            const todayCompleted = this.trainings.filter((training) => { return training.startedOn.indexOf(ymd) !== -1 }).length > 0

            return todayCompleted ? 'table-completed' : 'table-today'
          }
        }
        return null
      }

      let returnClass = ''
      this.trainings.forEach((training) => {
        if (training.startedOn.indexOf(ymd) !== -1) {
          returnClass = 'table-completed'
        }
      })

      return returnClass
    },
    dateDisable (ymd, date) {
      if (date.getMonth() + 1 !== this.currentMonth) return true
      if (ymd >= this.today) {
        if (this.routine.days.indexOf((date.getDay() + 6) % 7) !== -1) {
          return false
        }
        return true
      }

      let returnClass = true
      this.trainings.forEach((training) => {
        if (training.startedOn.indexOf(ymd) !== -1) {
          returnClass = false
        }
      })

      return returnClass
    },
    changeContext (context) {
      if (this.activeYMD !== context.activeYMD) {
        if (!this.currentMonth) {
          this.prepareDateParams(context.activeDate)
        } else if (this.currentMonth !== context.activeDate.getMonth() + 1 || this.currentYear !== context.activeDate.getFullYear()) {
          this.prepareDateParams(context.activeDate)
          this.getTrainings()
        } else {
          if (context.selectedYMD === this.today) {
            this.getTodayContext(context)
          } else if (context.selectedYMD > this.today) {
            this.detailsType = 'available'
          } else {
            this.detailsType = 'completed'
            this.training = this.trainings.filter((training) => {
              return training.startedOn.indexOf(context.selectedYMD) !== -1
            })[0]
            this.getExercises()
          }
        }
      } else if (context.selectedYMD === this.today) {
        this.getTodayContext(context)
      }
      this.currentMonth = context.activeDate.getMonth() + 1
      this.currentYear = context.activeDate.getFullYear()
      this.activeYMD = context.activeYMD
    },
    prepareDateParams (date) {
      const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let nextMonth, nextYear
      if (date.getMonth() === 11) {
        nextMonth = '01'
        nextYear = date.getFullYear() + 1
      } else {
        nextMonth = date.getMonth() < 8 ? '0' + (date.getMonth() + 2) : date.getMonth() + 2
        nextYear = date.getFullYear()
      }
      this.fromDateParam = date.getFullYear() + '-' + month + '-01 00:00:00'
      this.toDateParam = nextYear + '-' + nextMonth + '-01 00:00:00'
    },
    getTodayContext (context) {
      const todayTraining = this.trainings.filter((training) => { return training.startedOn.indexOf(context.selectedYMD) !== -1 })

      if (todayTraining.length > 0) {
        this.training = todayTraining[0]
        this.detailsType = 'completed'
        this.getExercises()
      } else {
        this.detailsType = 'create'
      }
    },
    getTodayDate () {
      const today = new Date()
      let todayMonth = today.getMonth() + 1
      if (todayMonth < 10) todayMonth = '0' + todayMonth
      let todayDay = today.getDate()
      if (todayDay < 10) todayDay = '0' + todayDay
      return today.getFullYear() + '-' + todayMonth + '-' + todayDay
    },
    setToday () {
      const now = new Date()
      this.selectedTraining = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    },
    clearDate () {
      this.selectedTraining = ''
      this.detailsType = 'none'
    },
    startTraining () {
      let trainingDefId = null
      const currentDay = (new Date().getDay() + 6) % 7
      for (let i = 0; i < this.routine.trainingDefs.length; i++) {
        if (this.routine.trainingDefs[i].dayOfWeek === currentDay) {
          trainingDefId = this.routine.trainingDefs[i].id
        }
      }
      if (trainingDefId) {
        fetch(this.$root.globalData.baseUrl + 'training', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ trainingDefId, routineId: this.routine.id, partyId: this.$root.globalData.party.id })
        }).then(async response => {
          try {
            if (await response.status === 200) {
              this.$root.successToast((await response.json()).message)
            } else {
              throw (await response.json()).message
            }
          } catch (exception) {
            this.$root.errorToast(exception)
          }
        })
      } else {
        this.$root.errorToast('There is no training to be started today')
      }
    },
    completeTraining () {
      fetch(this.$root.globalData.baseUrl + '/training/complete', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.training)
      }).then(async response => {
        try {
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
            this.training.finishedOn = new Date().toString()
          } else {
            throw (await response.json()).message
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    addSet (exercise) {
      this.$emit('add-set-event', exercise)
    },
    deleteSet (set) {
      fetch(this.$root.globalData.baseUrl + 'exercise/set/' + set.id, {
        method: 'DELETE'
      }).then(async response => {
        try {
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
            this.getExercises()
          } else {
            throw (await response.json()).message
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    openSubscribeModal () {
      this.$emit('open-subscribe-event')
    },
    reloadRoutines () {
      this.getRoutines()
    },
    reloadExercises () {
      this.getExercises()
    }
  },
  async mounted () {
    await this.getRoutines()
  }
}
</script>
