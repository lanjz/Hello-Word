<template>
  <div class="my">
    <div class="info-item">
      <div class="label">Github：</div>
      <div class="value">
        <div><a href="https://github.com/lanjz" target="_blank">https://github.com/lanjz</a></div>
      </div>
    </div>
    <div class="info-item">
      <div class="label">blog仓库：</div>
      <div class="value">
        <a href="https://github.com/lanjz/Hello-Word" target="_blank">https://github.com/lanjz/Hello-Word(blog文件夹)</a>
        <div class="cue">任何关于本博客的建议可以通过 <a href="https://github.com/lanjz/Hello-Word/issues" target="_blank">issues</a> 告知我</div>
      </div>
    </div>
    <div class="info-item">
      <div class="label">svg-mind-js：</div>
      <div class="value">
        <div><div class="value"><a href="https://github.com/lanjz/svg-mind-js" target="_blank">https://github.com/lanjz/svg-mind-js</a></div></div>
        <div class="cue">根据对象生成SVG脑图。注意：仅个人玩具使用</div>
      </div>
    </div>
    <div class="info-item">
      <div class="label">我的VX：</div>
      <div class="value"><img src="./static/vx.png" class="vx-img"></div>
    </div>
  </div>
</template>

<script>
export default {
name: "My"
}
</script>

<style scoped>
.my{
  padding-top: 70px;
}
.info-item{
  display: flex;
  margin-top: 25px;
  font-size: 16px;
}
.info-item .label{
  width: 200px;
  text-align: right;
}
.value{
  color: #666666;
}
.value .cue{
  font-size: 13px;
  color: #929191;
  margin-top: 5px;
}
.vx-img{
  width: 150px;
}
</style>