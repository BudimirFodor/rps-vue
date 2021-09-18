<template>
    <b-modal @ok="confirm()" id="delete-modal" :title="title">
        Are you sure you want to delete {{description}}?
        <template #modal-footer="{ cancel, ok }">
            <b-button variant="danger" @click="cancel()"><font-awesome-icon icon="times"/> Cancel</b-button>
            <b-button variant="success" @click="ok()"><font-awesome-icon icon="check"/> Confirm</b-button>
        </template>
    </b-modal>
</template>

<script>
export default {
  name: 'DeleteModal',
  data: function () {
    return {
      title: '',
      description: '',
      urlExtension: null
    }
  },
  methods: {
    confirm () {
      fetch(this.$root.globalData.baseUrl + this.urlExtension, {
        method: 'DELETE'
      }).then(async response => {
        try {
          if (await response.status === 200) {
            this.$root.successToast((await response.json()).message)
            this.$emit('delete-event')
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
    setDescription (description) {
      this.description = description
    },
    setUrlExtension (urlExtension) {
      this.urlExtension = urlExtension
    }
  }
}
</script>
