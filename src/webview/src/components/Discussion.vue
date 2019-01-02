<script>
import Note from './Note';
import icons from '../assets/icons';

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
      return this.isRepliesVisible ? this.chevronDownSvg : this.chevronRightSvg;
    },
  },
  methods: {
    toggleReplies() {
      this.isRepliesVisible = !this.isRepliesVisible;
    },
  },
  created() {
    this.chevronDownSvg = icons.chevronDown;
    this.chevronRightSvg = icons.chevronRight;
  },
};
</script>

<template>
  <div
    :class="{ collapsed: !isRepliesVisible }"
    class="discussion"
  >
    <note :noteable="initialDiscussion" />
    <div
      v-if="hasReplies"
      @click="toggleReplies"
      class="toggle-widget"
    >
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
