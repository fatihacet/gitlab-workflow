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

<style lang="scss">
.issuable-discussions {
  position: relative;

  &::before {
    content: '';
    border-left: 2px solid #919191;
    position: absolute;
    left: 35px;
    top: 16px;
    bottom: 0;
    z-index: -1;
  }
}
</style>
