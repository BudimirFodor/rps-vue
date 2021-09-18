<template>
  <div class="home">
    <div class="main-container">
        <div class="home-title">
          <h1>Workout Planner</h1>
          <h4>Welcome {{party.firstName}},</h4>
          <div class="row">
          <div class="col-md-2"><font-awesome-icon icon="user" class="fa-7x"/></div>
            <div class="col-md-3 description">
              <h3>Profile:</h3>
              <div>Username: {{party.username}}</div>
              <div>First Name: {{party.firstName}}</div>
              <div>Last Name: {{party.lastName}}</div>
            </div>
            <div class ="col-md-3 offset-md-4">
              <b-button variant="danger" title="Delete Profile" style="float: right" v-b-modal.delete-modal v-on:click="openDeleteModal()"><font-awesome-icon icon="trash"/></b-button>
              <b-button title="Change Password" style="float: right" v-b-modal.password-modal v-on:click="openPasswordModal(party)"><font-awesome-icon icon="key"/></b-button>
              <b-button title="Edit Profile" style="float: right" v-b-modal.edit-party-modal v-on:click="openEditModal(party)"><font-awesome-icon icon="edit"/></b-button>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <b-card bg-variant="info" text-variant="white" header="Setup" class="text-center" v-on:click="reroute('setup')">
              <div>
                <font-awesome-icon icon="cogs" class="fa-10x"/>
              </div>
              <b-card-text>Create, manage and share your exercises, training programs and routines.</b-card-text>
            </b-card>
          </div>
          <div class="col-md-6">
            <b-card bg-variant="info" text-variant="white" header="Calendar" class="text-center" v-on:click="reroute('calendar')">
              <div>
                <font-awesome-icon icon="calendar" class="fa-10x"/>
              </div>
              <b-card-text>Pick a routine and preview the trainings for a given routine. Previously completed trainings can be viewed, and current trainings can be tracked and completed.</b-card-text>
            </b-card>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeTemplate',
  data: function () {
    return {
      partyId: this.$root.globalData.party.id,
      party: {}
    }
  },
  methods: {
    async getParty () {
      fetch(this.$root.globalData.baseUrl + 'party/' + this.partyId, {
        method: 'GET'
      }).then(async response => {
        try {
          this.party = await response.json()
        } catch (exception) {
          this.$root.errorToast(exception)
        }
      })
    },
    reroute (destination) {
      this.$router.push({ path: destination })
    },
    openEditModal (party) {
      this.$emit('edit-modal-event', party)
    },
    openDeleteModal () {
      this.$emit('delete-modal-event')
    },
    openPasswordModal (party) {
      this.$emit('password-modal-event', party)
    },
    reloadParty () {
      this.getParty()
    }
  },
  async mounted () {
    await this.getParty()
  }
}
</script>

<style scoped>
.card {
    min-height: 35vh;
}

.card-body:hover {
    background-color: #0d99b5;
    cursor: pointer;
}
</style>
