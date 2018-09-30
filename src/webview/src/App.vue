<script>
import IssuableDetails from './components/IssuableDetails';

export default {
  name: 'app',
  data() {
    return {
      issuable: {
        title: 'Loading...',
      },
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
  </div>
</template>

<style lang="scss">
</style>
