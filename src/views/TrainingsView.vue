<template>
  <div class="trainings">
    <TrainingsTemplate v-on:add-training-event="addTrainingHandler" v-on:edit-training-event="editTrainingHandler"
        v-on:delete-training-event="deleteTrainingHandler" v-on:publish-training-event="publishTrainingHandler"
        v-on:share-training-event="shareTrainingHandler" v-on:add-exercise-event="addExerciseHandler" ref="parent"/>
    <DefinitionModal v-on:add-definition-event="reloadParentHandler" ref="editChild"/>
    <DeleteModal v-on:delete-event="reloadParentHandler" ref="deleteChild"/>
    <PublishModal v-on:publish-event="reloadParentHandler" ref="publishChild"/>
    <ShareModal ref="shareChild"/>
    <AddChildModal v-on:add-child-event="reloadParentHandler" ref="addExerciseChild"/>
  </div>
</template>

<script>
import TrainingsTemplate from '@/components/TrainingsTemplate.vue'
import DefinitionModal from '@/components/DefinitionModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import PublishModal from '@/components/PublishModal.vue'
import ShareModal from '@/components/ShareModal.vue'
import AddChildModal from '@/components/AddChildModal.vue'

export default {
  name: 'Trainings',
  components: {
    TrainingsTemplate,
    DefinitionModal,
    DeleteModal,
    PublishModal,
    ShareModal,
    AddChildModal
  },
  methods: {
    addTrainingHandler () {
      this.$refs.editChild.setTitle('New Training')
      this.$refs.editChild.clearDefinition('training')
    },
    editTrainingHandler (training) {
      this.$refs.editChild.setTitle('Edit Training ' + training.id)
      this.$refs.editChild.setDefinition(training, 'training')
    },
    deleteTrainingHandler (training) {
      this.$refs.deleteChild.setTitle('Delete Training ' + training.id)
      this.$refs.deleteChild.setDescription('training \'' + training.name + '\'')
      this.$refs.deleteChild.setUrlExtension('training/definition/' + training.id)
    },
    publishTrainingHandler (training) {
      this.$refs.publishChild.setTitle('Publish Training ' + training.id)
      this.$refs.publishChild.setDescription('training \'' + training.name + '\'')
      this.$refs.publishChild.setDefinition(training)
      this.$refs.publishChild.setUrlExtension('training/definition/publish')
    },
    shareTrainingHandler (training) {
      this.$refs.shareChild.setTitle('Share Training ' + training.id)
      this.$refs.shareChild.setDefinition(training)
      this.$refs.shareChild.setUrlExtension('training/definition/share')
    },
    addExerciseHandler (training) {
      this.$refs.addExerciseChild.setTitle('Add Exercises to Training ' + training.id)
      this.$refs.addExerciseChild.setParent(training.id, 'training')
    },
    reloadParentHandler () {
      this.$refs.parent.reloadTrainings()
    }
  }
}
</script>
