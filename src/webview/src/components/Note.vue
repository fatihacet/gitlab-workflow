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
    note() {
      return this.noteable.notes[0];
    },
    author() {
      return this.note.author;
    },
    createdAgo() {
      return moment(this.note.created_at).fromNow();
    },
  },
};
</script>

<template>
  <div class="note">
    <div class="note-header">
      <user-avatar :user="author" />
      {{ createdAgo }}
    </div>
    <note-body :note="note" />
  </div>
</template>
