<template>
    <b-modal @ok.prevent="save()" id="add-child-modal" :title="title">
        <div class="row" style="padding-bottom: 10px;">
            <div class="col-md-3">
                {{childName}}:
            </div>
            <div class="col-md-9">
                <b-form-select v-model="parentForm.childId" :options="children" aria-describedby="child-live-feedback" :state="validateState('childId')"></b-form-select>
                <b-form-invalid-feedback id="child-live-feedback">This is a required field.</b-form-invalid-feedback>
            </div>
        </div>
        <div v-if="type === 'routine'" class="row">
            <div class="col-md-3">
                Day of Week:
            </div>
            <div class="col-md-9">
                <b-form-select v-model="parentForm.dayOfWeek" :options="daysOfWeek" aria-describedby="dow-live-feedback" :state="validateState('dayOfWeek')"></b-form-select>
                <b-form-invalid-feedback id="dow-live-feedback">This is a required field.</b-form-invalid-feedback>
            </div>
        </div>
        <template #modal-footer="{ cancel, ok }">
            <b-button variant="danger" @click="cancel()"><font-awesome-icon icon="times"/> Cancel</b-button>
            <b-button variant="success" @click="ok()"><font-awesome-icon icon="check"/> Confirm</b-button>
        </template>
    </b-modal>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  name: 'AddChildModal',
  data: function () {
    return {
      title: '',
      getUrlExtension: '',
      postUrlExtension: '',
      parentForm: {},
      type: '',
      childName: '',
      children: [],
      daysOfWeek: [
        { value: null, text: 'Select the day of the week', disabled: true },
        { value: 0, text: 'Monday' },
        { value: 1, text: 'Tuesday' },
        { value: 2, text: 'Wednessday' },
        { value: 3, text: 'Thursday' },
        { value: 4, text: 'Friday' },
        { value: 5, text: 'Saturday' },
        { value: 6, text: 'Sunday' }
      ]
    }
  },
  validations: {
    parentForm: {
      childId: {
        required
      },
      dayOfWeek: {
        required
      }
    }
  },
  methods: {
    validateState (name) {
      const { $dirty, $error } = this.$v.parentForm[name]
      return $dirty ? !$error : null
    },
    async getChildren () {
      fetch(this.$root.globalData.baseUrl + this.getUrlExtension, {
        method: 'GET'
      }).then(async response => {
        try {
          const childrenResponse = await response.json()
          if (childrenResponse.length === 0) {
            this.children = [{ value: '', text: this.type === 'routine' ? 'There are no more available trainings' : 'There are no more available exercises' }]
          } else {
            this.children = [{ value: '', text: this.type === 'routine' ? 'Select a training' : 'Select an exercise' }]
            for (let i = 0; i < childrenResponse.length; i++) {
              this.children.push({ value: childrenResponse[i].id, text: childrenResponse[i].name + ' (' + childrenResponse[i].id + ')' })
            }
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    save () {
      if (this.$v.parentForm.childId.$error || (this.type === 'routine' && this.$v.parentForm.dayOfWeek.$error)) {
        return
      }
      fetch(this.$root.globalData.baseUrl + this.postUrlExtension, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.parentForm)
      }).then(async response => {
        try {
          this.$bvModal.hide('add-child-modal')
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
            this.$emit('add-child-event')
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
    setParent (parentId, type) {
      this.type = type
      this.childName = type === 'routine' ? 'Training' : 'Exercise'
      this.getUrlExtension = type === 'routine' ? 'training/definition/available/' + parentId : 'exercise/definition/available/' + parentId
      this.postUrlExtension = type === 'routine' ? 'routine/definition/training' : 'training/definition/exercise'
      this.parentForm = { parentId }
      this.getChildren()
      this.$v.parentForm.$touch()
    }
  }
}
</script>
