<script>
import Note from './Note';

export default {
  props: {
    noteable: {
      type: Object,
      required: true,
    },
  },
  components: {
    Note,
  },
};
</script>

<template>
  <div class="note system-note">
    <note :noteable="noteable" />
  </div>
</template>
