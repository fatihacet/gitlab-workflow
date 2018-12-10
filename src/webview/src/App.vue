<script>
import IssuableDetails from './components/IssuableDetails';
import IssuableDiscussions from './components/IssuableDiscussions';

const vscode = acquireVsCodeApi();

export default {
  name: 'app',
  data() {
    return {
      isLoading: false,
      issuable: {},
      discussions: [],
    };
  },
  components: {
    IssuableDetails,
    IssuableDiscussions,
  },
  computed: {
    notesById() {
      const notes = {}

      this.discussions.forEach((d) => {
        d.notes.forEach((n) => {
          notes[n.id] = n;
        });
      });

      notes[this.issuable.id] = this.issuable;
      return notes;
    },
  },
  created() {
    window.vsCodeApi = vscode;
    this.isLoading = true;

    window.addEventListener('message', event => {
      if (event.data.type === 'issuableFetch') {
        this.issuable = event.data.issuable;
        this.discussions = event.data.discussions;
        this.isLoading = false;
      } else if (event.data.type === 'markdownRendered') {
        const { ref, key, markdown } = event.data;
        const note = this.notesById[ref] || {};

        note[key] = markdown;
        note.markdownRenderedOnServer = true;
      }
    });
  },
}
</script>

<template>
  <div id="app">
    <h2 v-if="isLoading">Loading...</h2>
    <template v-else>
      <issuable-details :issuable="issuable" />
      <issuable-discussions :discussions="discussions" />
    </template>
  </div>
</template>

<style lang="scss">
body.vscode-light {
  * {
    border-color: #333;
  }

  .idiff.deletion {
    background: #fac5cd;
  }

  .idiff.addition {
    background: #c7f0d2;
  }
}
.capitalize {
  text-transform: capitalize;
}

code {
  padding: 2px 4px;
  color: #c0341d;
  background-color: #fbe5e1;
  border-radius: 4px;
}

.idiff.deletion {
  background: #df818f;
}

.idiff.addition {
  background: #7cba8d;
}
</style>
