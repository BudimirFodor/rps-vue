<template>
    <b-modal @ok.prevent="subscribe()" id="subscribe-modal" title="Subscribe to a routine">
        <div class="row">
            <div class="col-sm-2">
                Available routines:
            </div>
            <div class="col-sm-10">
                <b-form-select v-model="routine" :options="routines" aria-describedby="live-feedback" :state="validateState()"></b-form-select>
                <b-form-invalid-feedback id="live-feedback">This is a required field.</b-form-invalid-feedback>
            </div>
        </div>
        <template #modal-footer="{ cancel, ok }">
            <b-button variant="danger" @click="cancel()"><font-awesome-icon icon="times"/> Cancel</b-button>
            <b-button variant="success" @click="ok()"><font-awesome-icon icon="play"/> Subscribe</b-button>
        </template>
    </b-modal>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  name: 'ShareModal',
  data: function () {
    return {
      title: '',
      routine: null,
      definition: null,
      urlExtension: null,
      routines: []
    }
  },
  validations: {
    routine: {
      required
    }
  },
  methods: {
    validateState () {
      const { $dirty, $error } = this.$v.routine
      return $dirty ? !$error : null
    },
    async getAvailableRoutines () {
      fetch(this.$root.globalData.baseUrl + 'routine/definition/available/' + this.$root.globalData.party.id, {
        method: 'GET'
      }).then(async response => {
        try {
          const routinesResponse = await response.json()
          if (routinesResponse.length === 0) {
            this.routines = [{ value: null, text: 'No available routines', disabled: true }]
          } else {
            this.routines = [{ value: null, text: 'Please select a routine', disabled: true }]
            for (let i = 0; i < routinesResponse.length; i++) {
              this.routines.push({ value: routinesResponse[i].id, text: routinesResponse[i].name })
            }
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    subscribe () {
      if (this.$v.routine.$anyError) {
        return
      }
      fetch(this.$root.globalData.baseUrl + 'routine/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: this.routine, partyId: this.$root.globalData.party.id })
      }).then(async response => {
        try {
          this.$emit('subscribe-event')
          this.$bvModal.hide('subscribe-modal')
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    resetModal () {
      this.routine = null
      this.getAvailableRoutines()
    }
  },
  async mounted () {
    this.$v.routine.$touch()
    await this.getAvailableRoutines()
  }
}
</script>
