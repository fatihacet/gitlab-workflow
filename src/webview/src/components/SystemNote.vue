<script>
import NoteBody from './NoteBody';
import UserAvatar from './UserAvatar';

const moment = require('moment');

export default {
  props: {
    noteable: {
      type: Object,
      required: true,
    },
  },
  components: {
    NoteBody,
    UserAvatar,
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
  <div class="note system-note">
    <span class="avatar">
      <svg
        aria-hidden="true"
        data-prefix="fab"
        data-icon="gitlab"
        class="svg-inline--fa fa-gitlab fa-w-16"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M29.782 199.732L256 493.714 8.074 309.699c-6.856-5.142-9.712-13.996-7.141-21.993l28.849-87.974zm75.405-174.806c-3.142-8.854-15.709-8.854-18.851 0L29.782 199.732h131.961L105.187 24.926zm56.556 174.806L256 493.714l94.257-293.982H161.743zm349.324 87.974l-28.849-87.974L256 493.714l247.926-184.015c6.855-5.142 9.711-13.996 7.141-21.993zm-85.404-262.78c-3.142-8.854-15.709-8.854-18.851 0l-56.555 174.806h131.961L425.663 24.926z"
        ></path>
      </svg>
    </span>
    <div class="note-body-wrapper">
      <user-avatar :user="author" :show-avatar="false"/>
      <note-body :note="note"/>
      · {{ createdAgo }}
    </div>
  </div>
</template>

<style lang="scss">
.system-note {
  border: none;
  padding: 0 16px;

  .avatar {
    border: 1px solid #919191;
    border-radius: 100%;
    display: inline-block;
    height: 30px;
    width: 30px;
    margin-left: 4px;

    svg {
      width: 16px;
      height: 16px;
      position: relative;
      top: 7px;
      left: 7px;
    }
  }

  .note-body-wrapper {
    display: inline-block;
    position: relative;
    top: 3px;

    > * {
      display: inline-block;
    }

    .note-body {
      margin-left: 5px;
    }
  }
}
</style>
