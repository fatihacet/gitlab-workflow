<script>
import UserAvatar from './UserAvatar';
import NoteBody from './NoteBody'

const moment = require('moment');

export default {
  name: 'Note',
  props: {
    noteable: {
      type: Object,
      required: true,
    }
  },
  components: {
    UserAvatar,
    NoteBody,
  },
  computed: {
    author() {
      return this.noteable.author;
    },
    createdAgo() {
      return moment(this.noteable.created_at).fromNow();
    },
  },
};
</script>

<template>
  <div class="note">
    <div class="note-header">
      <user-avatar :user="author" :size="40" /> · {{ createdAgo }}
    </div>
    <note-body :note="noteable" />
  </div>
</template>

<style lang="scss">
.note {
  border: 1px solid #919191;
  border-radius: 4px;
  padding: 16px;
  margin: 16px 0;
  background: var(--background-color);

  .avatar {
    margin-right: 10px;
  }

  &:not(.system-note) {
    .note-header {
      position: relative;
      top: -8px;
    }

    .avatar {
      position: relative;
      top: 8px;
    }

    .note-body {
      margin-top: -12px;
    }
  }
}
</style>
