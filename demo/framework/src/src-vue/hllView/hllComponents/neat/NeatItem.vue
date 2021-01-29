<template>
  <div class="hll-neat-item" :class="{'align-center': !!alignCenter}">
    <div class="label">
      <span v-if="label">{{label||''}}</span>
      <slot name="label"></slot>
    </div>
    <div class="value">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HllNeatItem",
  componentAlias: "HllNeatItem",
  props: ['label', 'alignCenter']
}
</script>

<style scoped lang="scss">
.hll-neat-item{
  width: 50%;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  line-height: 1.5;

  div.label{
    display: inline-flex;
    -webkit-box-pack: end;
    justify-content: flex-end;
    color: #606266;
    -ms-flex-negative: 0;
    flex-shrink: 0;
  }
  div.value{
    flex: 1;
    color: #f16622;
    display: block;
    word-break: break-all;
  }
}
.hll-neat-item.align-center{
  align-items: center;
}
</style>
