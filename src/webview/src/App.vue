<script>
import IssuableDetails from './components/IssuableDetails';

export default {
  name: 'app',
  data() {
    return {
      issuable: {
        title: 'Loading...',
      },
      discussions: [],
    };
  },
  components: {
    IssuableDetails,
  },
  created() {
    window.addEventListener('message', event => {
      this.issuable = event.data.issuable;
    });
  },
}
</script>

<template>
  <div id="app">
    <issuable-details :issuable="issuable" />
    <issuable-discussions :discussions="discussions" />
  </div>
</template>

<style lang="scss">
</style>
