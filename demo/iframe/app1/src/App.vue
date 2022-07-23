<template>
  <div id="app">
    <iframe :src="iframeSrc" frameborder="0" id="iframe" @load="loadIframe"></iframe>
  </div>
</template>
<script>
export default {
  methods: {
    loadIframe(){
      console.log(arguments)
    }
  },
  mounted() {
    // index.html

  },
  created() {
    const { pathname, hash, search, href, origin } = window.location
    this.iframeSrc = 'http://localhost:8081' + href.substring(origin.length)
  }
}
</script>
<style>
#iframe {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

</style>
