<template>
    <b-modal @ok.prevent="publish()" id="publish-modal" :title="title">
        Are you sure you want to publish {{description}}?
        <br>
        <span class="note">Published configurations can no longer be edited nor deleted.</span>
        <template #modal-footer="{ cancel, ok }">
            <b-button variant="danger" @click="cancel()"><font-awesome-icon icon="times"/> Cancel</b-button>
            <b-button variant="success" @click="ok()"><font-awesome-icon icon="check"/> Confirm</b-button>
        </template>
    </b-modal>
</template>

<script>
export default {
  name: 'PublishModal',
  data: function () {
    return {
      title: '',
      description: '',
      definition: {},
      urlExtension: ''
    }
  },
  methods: {
    publish () {
      fetch(this.$root.globalData.baseUrl + this.urlExtension, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.definition)
      }).then(async response => {
        try {
          this.$emit('publish-event')
          this.$bvModal.hide('publish-modal')
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    setTitle (title) {
      this.title = title
    },
    setDescription (description) {
      this.description = description
    },
    setDefinition (definition) {
      this.definition = definition
    },
    setUrlExtension (urlExtension) {
      this.urlExtension = urlExtension
    }
  }
}
</script>
