<template>
  <div class="exercises">
    <ExercisesTemplate v-on:add-exercise-event="addExerciseHandler" v-on:edit-exercise-event="editExerciseHandler"
        v-on:delete-exercise-event="deleteExerciseHandler" v-on:publish-exercise-event="publishExerciseHandler"
        v-on:share-exercise-event="shareExerciseHandler" ref="parent"/>
    <DefinitionModal v-on:add-definition-event="reloadParentHandler" ref="editChild"/>
    <DeleteModal v-on:delete-event="reloadParentHandler" ref="deleteChild"/>
    <PublishModal v-on:publish-event="reloadParentHandler" ref="publishChild"/>
    <ShareModal ref="shareChild"/>
  </div>
</template>

<script>
import ExercisesTemplate from '@/components/ExercisesTemplate.vue'
import DefinitionModal from '@/components/DefinitionModal.vue'
import DeleteModal from '@/components/DeleteModal.vue'
import PublishModal from '@/components/PublishModal.vue'
import ShareModal from '@/components/ShareModal.vue'

export default {
  name: 'Exercises',
  components: {
    ExercisesTemplate,
    DefinitionModal,
    DeleteModal,
    PublishModal,
    ShareModal
  },
  methods: {
    addExerciseHandler () {
      this.$refs.editChild.setTitle('New Exercise')
      this.$refs.editChild.clearDefinition('exercise')
    },
    editExerciseHandler (exercise) {
      this.$refs.editChild.setTitle('Edit Exercise ' + exercise.id)
      this.$refs.editChild.setDefinition(exercise, 'exercise')
    },
    deleteExerciseHandler (exercise) {
      this.$refs.deleteChild.setTitle('Delete Exercise ' + exercise.id)
      this.$refs.deleteChild.setDescription('exercise \'' + exercise.name + '\'')
      this.$refs.deleteChild.setUrlExtension('exercise/definition/' + exercise.id)
    },
    publishExerciseHandler (exercise) {
      this.$refs.publishChild.setTitle('Publish Exercise ' + exercise.id)
      this.$refs.publishChild.setDescription('exercise \'' + exercise.name + '\'')
      this.$refs.publishChild.setDefinition(exercise)
      this.$refs.publishChild.setUrlExtension('exercise/definition/publish')
    },
    shareExerciseHandler (exercise) {
      this.$refs.shareChild.setTitle('Share Exercise ' + exercise.id)
      this.$refs.shareChild.setDefinition(exercise)
      this.$refs.shareChild.setUrlExtension('exercise/definition/share')
    },
    reloadParentHandler () {
      this.$refs.parent.reloadExercises()
    }
  }
}
</script>
