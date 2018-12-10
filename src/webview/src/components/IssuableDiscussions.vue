<script>
import Note from './Note';
import SystemNote from './SystemNote';

export default {
  props: {
    discussions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getComponentName(discussion) {
      if (discussion.individual_note) {
        if (discussion.notes[0].system) {
          return SystemNote;
        }

        return Note;
      }
    },
  },
};
</script>

<template>
  <div class="issuable-discussions">
    <component
      v-for="discussion in discussions"
      :key="discussion.id"
      :is="getComponentName(discussion)"
      :noteable="discussion"
    />
  </div>
</template>
