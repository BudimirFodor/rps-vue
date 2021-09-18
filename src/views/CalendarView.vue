<template>
  <div class="exercises">
    <CalendarTemplate v-on:add-set-event="addSetHandler" v-on:open-subscribe-event="resetSubscribeHandler" ref="parent"/>
    <SetModal v-on:add-set-event="reloadParentExercisesHandler" ref="setChild"/>
    <SubscribeModal ref="subscribeChild"/>
  </div>
</template>

<script>
import CalendarTemplate from '@/components/CalendarTemplate.vue'
import SetModal from '@/components/SetModal.vue'
import SubscribeModal from '@/components/SubscribeModal.vue'

export default {
  name: 'Exercises',
  components: {
    CalendarTemplate,
    SetModal,
    SubscribeModal
  },
  methods: {
    addSetHandler (exercise) {
      this.$refs.setChild.setTitle('Add set to ' + exercise.name)
      this.$refs.setChild.setExercise(exercise)
    },
    resetSubscribeHandler () {
      this.$refs.subscribeChild.resetModal()
    },
    reloadParentRoutinesHandler () {
      this.$refs.parent.reloadRoutines()
    },
    reloadParentExercisesHandler () {
      this.$refs.parent.reloadExercises()
    }
  }
}
</script>
