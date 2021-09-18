<template>
    <b-modal @ok.prevent="share()" id="share-modal" :title="title">
        <div class="row">
            <div class="col-sm-2">
                Party:
            </div>
            <div class="col-sm-10">
                <b-form-select v-model="selectedPartyId" :options="parties" placeholder="Select party to share with"
                  aria-describedby="live-feedback" :state="validateState()"></b-form-select>
                <b-form-invalid-feedback id="live-feedback">This is a required field.</b-form-invalid-feedback>
            </div>
        </div>
        <template #modal-footer="{ cancel, ok }">
            <b-button variant="danger" @click="cancel()"><font-awesome-icon icon="times"/> Cancel</b-button>
            <b-button variant="success" @click="ok()"><font-awesome-icon icon="share-square"/> Confirm</b-button>
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
      selectedPartyId: null,
      definition: null,
      urlExtension: null,
      parties: []
    }
  },
  validations: {
    selectedPartyId: {
      required
    }
  },
  methods: {
    validateState () {
      const { $dirty, $error } = this.$v.selectedPartyId
      return $dirty ? !$error : null
    },
    async getParties () {
      fetch(this.$root.globalData.baseUrl + 'party/' + this.$root.globalData.party.id + '/all', {
        method: 'GET'
      }).then(async response => {
        try {
          const partiesResponse = await response.json()
          this.parties = [{ value: null, text: 'Please select a party', disabled: true }]
          for (let i = 0; i < partiesResponse.length; i++) {
            this.parties.push({ value: partiesResponse[i].id, text: partiesResponse[i].firstName + ' ' + partiesResponse[i].lastName })
          }
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    share () {
      if (this.$v.selectedPartyId.$anyError) {
        return
      }
      fetch(this.$root.globalData.baseUrl + this.urlExtension + '/' + this.selectedPartyId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.definition)
      }).then(async response => {
        try {
          this.$bvModal.hide('share-modal')
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
          } else {
            throw (await response.json()).message
          }
        } catch (exception) {
          console.log(exception)
          this.$root.errorToast(exception)
        }
      })
    },
    setTitle (title) {
      this.title = title
    },
    setDefinition (definition) {
      this.definition = definition
    },
    setUrlExtension (urlExtension) {
      this.urlExtension = urlExtension
      this.selectedPartyId = null
      this.$v.selectedPartyId.$touch()
    }
  },
  async mounted () {
    await this.getParties()
  }
}
</script>
