<template>
    <b-modal @ok.prevent="save()" id="password-modal" title="Change Password">
        <b-row class="my-1">
            <b-col sm="4">
                <label for="old-pass">Old Password:</label>
            </b-col>
            <b-col sm="8">
                <b-form-input v-model="partyForm.oldPassword" type="password" id="old-pass" placeholder="Enter your old password here" :state="validateState('oldPassword')"
                  aria-describedby="old-pass-live-feedback"></b-form-input>
                <b-form-invalid-feedback id="old-pass-live-feedback">This is a required field.</b-form-invalid-feedback>
            </b-col>
        </b-row>
        <b-row class="my-1">
            <b-col sm="4">
                <label for="new-pass">New Password:</label>
            </b-col>
            <b-col sm="8">
                <b-form-input v-model="partyForm.password" type="password" id="new-pass" placeholder="Enter your new password here" :state="validateState('password')"
                  aria-describedby="pass-live-feedback"></b-form-input>
                <b-form-invalid-feedback id="pass-live-feedback">This is a required field. Minimum 6 characters.</b-form-invalid-feedback>
            </b-col>
        </b-row>
        <b-row class="my-1">
            <b-col sm="4">
                <label for="repeat-pass">Repeat Password:</label>
            </b-col>
            <b-col sm="8">
                <b-form-input v-model="partyForm.repeatPassword" type="password" id="repeat-pass" placeholder="Please repeat the new password" :state="validateState('repeatPassword')"
                  aria-describedby="repeat-pass-live-feedback"></b-form-input>
                <b-form-invalid-feedback id="repeat-pass-live-feedback">This is a required field. Must match password.</b-form-invalid-feedback>
            </b-col>
        </b-row>

        <template #modal-footer="{ cancel, ok }">
            <b-button variant="danger" @click="cancel()"><font-awesome-icon icon="times"/> Cancel</b-button>
            <b-button variant="success" @click="ok()"><font-awesome-icon icon="save"/> Save</b-button>
        </template>
    </b-modal>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, sameAs, minLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  name: 'ChangePasswordModal',
  data: function () {
    return {
      partyForm: { oldPassword: '', repeatPassword: '' }
    }
  },
  validations: {
    partyForm: {
      oldPassword: {
        required
      },
      password: {
        required,
        minLength: minLength(6)
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs('password')
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
      delete this.partyForm.repeatPassword
      fetch(this.$root.globalData.baseUrl + 'party/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.partyForm)
      }).then(async response => {
        try {
          this.$bvModal.hide('password-modal')
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
          } else {
            throw (await response.json()).message
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    setPartyForm (party) {
      this.partyForm = JSON.parse(JSON.stringify(party))
      this.partyForm.password = null
      this.$v.partyForm.$touch()
    }
  }
}
</script>
