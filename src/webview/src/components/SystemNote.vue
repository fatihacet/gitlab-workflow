<script>
import NoteBody from './NoteBody';
import UserAvatar from './UserAvatar';
import icons from '../assets/icons';

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
    author() {
      return this.noteable.author;
    },
    createdAgo() {
      return moment(this.noteable.created_at).fromNow();
    },
  },
  created() {
    this.gitLabLogoSvg = icons.gitLabLogo;
  },
};
</script>

<template>
  <div class="note system-note">
    <span class="avatar" v-html="gitLabLogoSvg"></span>
    <div class="note-body-wrapper">
      <user-avatar :user="author" :show-avatar="false"/>
      <note-body :note="noteable"/>
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
