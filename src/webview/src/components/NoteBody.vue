<script>
const md = require('markdown-it')().use(require('markdown-it-checkbox'));

export default {
  name: 'NoteBody',
  props: {
    note: {
      type: Object,
      required: true,
    },
  },
  computed: {
    renderedNoteBody() {
      return this.note.markdownRenderedOnServer ? this.note.body : md.render(this.note.body);
    },
  },
  mounted() {
    window.vsCodeApi.postMessage({
      command: 'renderMarkdown',
      markdown: this.note.body,
      ref: this.note.id,
      key: 'body',
    });
  },
};
</script>

<template>
  <div class="note-body">
    <div class="body" v-html="renderedNoteBody"></div>
  </div>
</template>
