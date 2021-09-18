<template>
    <b-modal @ok.prevent="save()" id="set-modal" :title="title">
        <div class="row">
            <div class="col-sm-2">
                <label for="num-of-reps">Number of reps:</label>
            </div>
            <div class="col-sm-10">
                <b-form-input id="num-of-reps" v-model="setForm.numberOfReps" type="number" aria-describedby="reps-live-feedback" :state="validateState('numberOfReps')"></b-form-input>
                <b-form-invalid-feedback id="reps-live-feedback">This is a required field.</b-form-invalid-feedback>
            </div>
        </div>
        <div v-if="exercise.exerciseType==='WEIGHT'" class="row">
            <div class="col-sm-2">
                <label for="weight-val">Weight:</label>
            </div>
            <div class="col-sm-10">
                <b-form-input id="weight-val" v-model="setForm.weightValue" type="number" aria-describedby="weight-val-live-feedback" :state="validateState('weightValue')"></b-form-input>
                <b-form-invalid-feedback id="weight-val-live-feedback">This is a required field.</b-form-invalid-feedback>
            </div>
            <div class="note">Weight is measured in kg.</div>
        </div>
        <div v-else-if="exercise.exerciseType==='DISTANCE'" class="row">
            <div class="col-sm-2">
                <label for="distance-val">Distance:</label>
            </div>
            <div class="col-sm-10">
                <b-form-input id="distance-val" v-model="setForm.distanceValue" type="number" aria-describedby="distance-val-live-feedback" :state="validateState('distanceValue')"></b-form-input>
                <b-form-invalid-feedback id="distance-val-live-feedback">This is a required field.</b-form-invalid-feedback>
            </div>
            <div class="note">Distance is measured in km.</div>
        </div>
        <div v-else class="row">
            <div class="col-sm-2">
                <label for="time-val">Time:</label>
            </div>
            <div class="col-sm-10">
                <b-form-input id="time-val" v-model="setForm.timeValue" type="number" aria-describedby="time-val-live-feedback" :state="validateState('timeValue')"></b-form-input>
                <b-form-invalid-feedback id="time-val-live-feedback">This is a required field.</b-form-invalid-feedback>
            </div>
            <div class="note">Time is measured in seconds.</div>
        </div>
        <template #modal-footer="{ cancel, ok }">
            <b-button variant="danger" @click="cancel()"><font-awesome-icon icon="times"/> Cancel</b-button>
            <b-button variant="success" @click="ok()"><font-awesome-icon icon="save"/> Save</b-button>
        </template>
    </b-modal>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  name: 'SetModal',
  data: function () {
    return {
      title: '',
      setForm: { numberOfReps: null, weightValue: null, distanceValue: null, timeValue: null },
      exercise: {}
    }
  },
  validations: {
    setForm: {
      numberOfReps: {
        required
      },
      weightValue: {
        required
      },
      distanceValue: {
        required
      },
      timeValue: {
        required
      }
    }
  },
  methods: {
    validateState (name) {
      const { $dirty, $error } = this.$v.setForm[name]
      return $dirty ? !$error : null
    },
    save () {
      if (this.$v.setForm.numberOfReps.$error || (this.exercise.exerciseType === 'WEIGHT' && this.$v.setForm.weightValue.$error) ||
        (this.exercise.exerciseType === 'DISTANCE' && this.$v.setForm.distanceValue.$error) || (this.exercise.exerciseType === 'TIME' && this.$v.setForm.timeValue.$error)) {
        return
      }
      fetch(this.$root.globalData.baseUrl + 'exercise/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...this.setForm, exerciseId: this.exercise.id })
      }).then(async response => {
        try {
          this.$bvModal.hide('set-modal')
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
            this.$emit('add-set-event')
          } else {
            throw (await response.json()).message
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    setTitle (title) {
      this.title = title
    },
    setExercise (exercise) {
      this.exercise = exercise
      this.setForm.numberOfReps = null
      this.setForm.weightValue = null
      this.setForm.distanceValue = null
      this.setForm.timeValue = null
      this.$v.setForm.$touch()
    }
  }
}
</script>
