<script>
import Note from './Note';

export default {
  name: 'Discussion',
  props: {
    noteable: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isRepliesVisible: true,
    };
  },
  components: {
    Note,
  },
  computed: {
    initialDiscussion() {
      return this.noteable.notes[0];
    },
    replies() {
      return this.noteable.notes.slice(1);
    },
    hasReplies() {
      return this.replies.length > 0;
    },
    toggleRepliesText() {
      return this.isRepliesVisible ? 'Collapse replies' : 'Expand replies';
    },
    toggleRepliesIcon() {
      const chevronDown = '<svg aria-hidden="true" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>';
      const chevronRight = '<svg aria-hidden="true" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg>';

      return this.isRepliesVisible ? chevronDown : chevronRight;
    },
  },
  methods: {
    toggleReplies() {
      this.isRepliesVisible = !this.isRepliesVisible;
    },
  },
};
</script>

<template>
  <div
    :class="{ collapsed: !isRepliesVisible }"
    class="discussion"
  >
    <note :noteable="initialDiscussion" />
    <div @click="toggleReplies" class="toggle-widget">
      <span
        class="chevron"
        v-html="toggleRepliesIcon"></span> {{ toggleRepliesText }}
    </div>
    <template v-if="isRepliesVisible">
      <note
        v-for="note in replies"
        :key="note.id"
        :noteable="note"
      />
    </template>
  </div>
</template>

<style lang="scss">
.discussion {
  border: 1px solid #919191;
  border-radius: 4px;
  background: var(--background-color);

  &.collapsed {
    .toggle-widget {
      border-radius: 0 0 4px 4px;
    }
  }

  > .note {
    border: none;
    margin: 0;
  }

  .toggle-widget {
    background: var(--vscode-activityBar-dropBackground);
    padding: 8px 16px;
    cursor: pointer;
    user-select: none;
  }

  .chevron svg {
    width: 10px;
    height: 10px;
  }
}
</style>
