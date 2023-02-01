<template>
  <div style="margin: 20px">
    <draggable
      tag="el-collapse"
      :list="list"
      :component-data="{
        on: {
          change: this.inputChanged,
        },
        props: {
          value: this.activeNames,
        },
      }"
    >
      <el-collapse-item
        v-for="item in list"
        :key="item.id"
        :title="item.title"
        :name="item.id"
      >
        <draggable :list="item.text">
          <div
            style="cursor: pointer"
            v-for="(lign, idx) in item.text"
            :key="idx"
          >
            {{ lign }}
          </div>
        </draggable>
      </el-collapse-item>
    </draggable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: '一级',
          id: 1,
          text: ['测试001', '测试002']
        },
        {
          title: '二级',
          id: 2,
          text: ['测试003', '测试004']
        }
      ],
      activeNames: [1, 2]
    }
  },
  methods: {
    inputChanged(val) {
      this.activeNames = val;
    },
  },
};
</script>
