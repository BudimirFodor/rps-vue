<template>
  <div class="routines">
    <RoutinesTemplate v-on:add-routine-event="addRoutineHandler" v-on:edit-routine-event="editRoutineHandler"
        v-on:delete-routine-event="deleteRoutineHandler" v-on:publish-routine-event="publishRoutineHandler"
        v-on:share-routine-event="shareRoutineHandler" v-on:add-training-event="addTrainingHandler" ref="parent"/>
    <DefinitionModal v-on:add-definition-event="reloadParentHandler" ref="editChild"/>
    <DeleteModal v-on:delete-event="reloadParentHandler" ref="deleteChild"/>
    <PublishModal v-on:publish-event="reloadParentHandler" ref="publishChild"/>
    <ShareModal ref="shareChild"/>
    <AddChildModal v-on:add-child-event="reloadParentHandler" ref="addTrainingChild"/>
  </div>
</template>

<script>
import RoutinesTemplate from '@/components/RoutinesTemplate.vue'
import DefinitionModal from '@/components/DefinitionModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import PublishModal from '@/components/PublishModal.vue'
import ShareModal from '@/components/ShareModal.vue'
import AddChildModal from '@/components/AddChildModal.vue'

export default {
  name: 'Routines',
  components: {
    RoutinesTemplate,
    DefinitionModal,
    DeleteModal,
    PublishModal,
    ShareModal,
    AddChildModal
  },
  methods: {
    addRoutineHandler () {
      this.$refs.editChild.setTitle('New Routine')
      this.$refs.editChild.clearDefinition('routine')
    },
    editRoutineHandler (routine) {
      this.$refs.editChild.setTitle('Edit Routine ' + routine.id)
      this.$refs.editChild.setDefinition(routine, 'routine')
    },
    deleteRoutineHandler (routine) {
      this.$refs.deleteChild.setTitle('Delete Routine ' + routine.id)
      this.$refs.deleteChild.setDescription('routine \'' + routine.name + '\'')
      this.$refs.deleteChild.setUrlExtension('routine/definition/' + routine.id)
    },
    publishRoutineHandler (routine) {
      this.$refs.publishChild.setTitle('Publish Routine ' + routine.id)
      this.$refs.publishChild.setDescription('routine \'' + routine.name + '\'')
      this.$refs.publishChild.setDefinition(routine)
      this.$refs.publishChild.setUrlExtension('routine/definition/publish')
    },
    shareRoutineHandler (routine) {
      this.$refs.shareChild.setTitle('Share Routine ' + routine.id)
      this.$refs.shareChild.setDefinition(routine)
      this.$refs.shareChild.setUrlExtension('routine/definition/share')
    },
    addTrainingHandler (routine) {
      this.$refs.addTrainingChild.setTitle('Add Training to Routine ' + routine.id)
      this.$refs.addTrainingChild.setParent(routine.id, 'routine')
    },
    reloadParentHandler () {
      this.$refs.parent.reloadRoutines()
    }
  }
}
</script>
