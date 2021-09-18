<template>
    <b-modal @ok.prevent="save()" id="definition-modal" :title="title">
        <b-row class="my-1">
            <b-col sm="4">
                <label for="name">Name:</label>
            </b-col>
            <b-col sm="8">
                <b-form-input id="name" :placeholder="'Enter ' + type + ' name'" v-model="definitionForm.name"
                  aria-describedby="live-feedback" :state="validateState('name')"></b-form-input>
                <b-form-invalid-feedback id="live-feedback">This is a required field.</b-form-invalid-feedback>
            </b-col>
        </b-row>
        <b-row class="my-1">
            <b-col sm="4">
                <label for="description">Description:</label>
            </b-col>
            <b-col sm="8">
                <b-form-input id="description" :placeholder="'Enter a description for the ' + type" v-model="definitionForm.description"></b-form-input>
            </b-col>
        </b-row>
        <b-form-group v-if="type === 'exercise'" label="Exercise type:" v-slot="{ ariaDescribedby }">
            <b-form-radio v-model="definitionForm.exerciseType" :aria-describedby="ariaDescribedby" name="some-radios" value="WEIGHT" selected>Weight</b-form-radio>
            <b-form-radio v-model="definitionForm.exerciseType" :aria-describedby="ariaDescribedby" name="some-radios" value="DISTANCE">Distance</b-form-radio>
            <b-form-radio v-model="definitionForm.exerciseType" :aria-describedby="ariaDescribedby" name="some-radios" value="TIME">Time</b-form-radio>
        </b-form-group>

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
  name: 'DefinitionModal',
  data: function () {
    return {
      title: '',
      definitionForm: {},
      type: null
    }
  },
  validations: {
    definitionForm: {
      name: {
        required
      }
    }
  },
  methods: {
    validateState (name) {
      const { $dirty, $error } = this.$v.definitionForm[name]
      return $dirty ? !$error : null
    },
    save () {
      if (this.$v.definitionForm.$anyError) {
        return
      }
      fetch(this.$root.globalData.baseUrl + this.type + '/definition', {
        method: this.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.definitionForm)
      }).then(async response => {
        try {
          this.$bvModal.hide('definition-modal')
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
            this.$emit('add-definition-event')
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
    setDefinition (definition, type) {
      this.definitionForm = JSON.parse(JSON.stringify(definition))
      this.definitionForm.partyId = this.$root.globalData.party.id
      this.method = 'PUT'
      this.type = type
      this.$v.definitionForm.$touch()
    },
    clearDefinition (type) {
      this.definitionForm = { createdBy: this.$root.globalData.party.username, partyId: this.$root.globalData.party.id, description: '' }
      if (type === 'exercise') {
        this.definitionForm.exerciseType = 'WEIGHT'
      }
      this.method = 'POST'
      this.type = type
      this.$v.definitionForm.$touch()
    }
  }
}
</script>
