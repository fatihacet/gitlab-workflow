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

<style lang="scss">
.note-body {
  margin-left: 56px;
  line-height: 21px;

  .badge {
    padding: 0 8px;
    line-height: 16px;
    border-radius: 36px;
    font-size: 12px;
    display: inline-block;
  }

  .body p {
    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
