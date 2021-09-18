<template>
  <div class="home">
    <HomeTemplate v-on:edit-modal-event="editModalHandler" v-on:password-modal-event="passwordModalHandler" v-on:delete-modal-event="deleteModalHandler" ref="parent"/>
    <ChangePasswordModal ref="passwordChild"/>
    <EditPartyModal v-on:reload-party-event="reloadPartyHandler" ref="editChild"/>
    <DeleteModal v-on:delete-event="deletePartyHandler" ref="deleteChild"/>
  </div>
</template>

<script>
import HomeTemplate from '@/components/HomeTemplate.vue'
import ChangePasswordModal from '@/components/ChangePasswordModal.vue'
import EditPartyModal from '@/components/EditPartyModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'

export default {
  name: 'Home',
  components: {
    HomeTemplate,
    ChangePasswordModal,
    EditPartyModal,
    DeleteModal
  },
  methods: {
    editModalHandler (party) {
      this.$refs.editChild.setPartyForm(party)
    },
    passwordModalHandler (party) {
      this.$refs.passwordChild.setPartyForm(party)
    },
    deleteModalHandler () {
      this.$refs.deleteChild.setTitle('Delete account')
      this.$refs.deleteChild.setDescription('your account')
      this.$refs.deleteChild.setUrlExtension('party/' + this.$root.globalData.party.id)
    },
    reloadPartyHandler () {
      this.$refs.parent.reloadParty()
    },
    deletePartyHandler () {
      console.log('logout here')
    }
  }
}
</script>
