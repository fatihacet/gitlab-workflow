<script>
const moment = require('moment');
const md = require('markdown-it')().use(require('markdown-it-checkbox'));

export default {
  props: {
    discussions: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <div class="issuable-discussions">
    <ul>

    </ul>
  </div>
</template>
