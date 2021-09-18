<template>
    <b-modal @ok.prevent="save()" id="edit-party-modal" title="Edit Profile">
      <b-form>
        <b-row class="my-1">
            <b-col sm="4">
                <label for="first-name">First Name:</label>
            </b-col>
            <b-col sm="8">
                <b-form-input v-model="partyForm.firstName" :state="validateState('firstName')" id="first-name" placeholder="Enter your first name"
                  aria-describedby="first-name-live-feedback"></b-form-input>
                <b-form-invalid-feedback id="first-name-live-feedback">This is a required field.</b-form-invalid-feedback>
            </b-col>
        </b-row>
        <b-row class="my-1">
            <b-col sm="4">
                <label for="last-name">Last Name:</label>
            </b-col>
            <b-col sm="8">
                <b-form-input v-model="partyForm.lastName" :state="validateState('lastName')" id="last-name" placeholder="Enter your last name"
                  aria-describedby="last-name-live-feedback"></b-form-input>
                <b-form-invalid-feedback id="last-name-live-feedback">This is a required field.</b-form-invalid-feedback>
            </b-col>
        </b-row>
      </b-form>
      <template #modal-footer="{ cancel, ok }">
        <b-button variant="danger" @click="cancel()"><font-awesome-icon icon="times"/> Cancel</b-button>
        <b-button variant="success" v-on:click="ok()"><font-awesome-icon icon="save"/> Save</b-button>
      </template>
    </b-modal>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  name: 'EditPartyModal',
  data: function () {
    return {
      partyForm: { firstName: '', lastName: '' }
    }
  },
  validations: {
    partyForm: {
      firstName: {
        required
      },
      lastName: {
        required
      }
    }
  },
  methods: {
    validateState (name) {
      const { $dirty, $error } = this.$v.partyForm[name]
      return $dirty ? !$error : null
    },
    save () {
      if (this.$v.partyForm.$anyError) {
        return
      }
      fetch(this.$root.globalData.baseUrl + 'party/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.partyForm)
      }).then(async response => {
        try {
          this.$root.$bvToast.toast((await response.json()).message, {
            title: 'Success',
            variant: 'success',
            solid: true,
            'no-auto-hide': true
          })
          this.$emit('reload-party-event')
          this.$bvModal.hide('edit-party-modal')
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    setPartyForm (party) {
      this.partyForm = JSON.parse(JSON.stringify(party))
      this.$v.partyForm.$touch()
    }
  }
}
</script>
