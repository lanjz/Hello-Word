<template>
    <div>
        <h1>FOO</h1>
        <div @click="push">Foo</div>
    </div>
</template>

<script>
  export default {
    name: "Foo",
    methods: {
      push() {
        debugger
        this.$router.push('/bar')
      }
    },
  }
</script>

<style scoped>

</style>