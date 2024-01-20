<script setup lang="ts"></script>

<template>
  <h3>生命周期</h3>
  <ul>
    <li>constructor()：元素创建时执行，可以做初始化数据覆盖默认属性等操作</li>
    <li>connectCallback()：当元素插入到DOM中时执行(包括元素移动时)</li>
    <li>disconnectCallback()：当元素移出DOM中时执行</li>
    <li>attributeChangedCallback()：响应属性发生变化时</li>
    <li>adoptedCallback()：元素移动到新的document时触发(没试出啥效果)</li>
    <li>
      shouldUpdate()：在这个方法中可以手动比较属性的新旧时，通过返回
      true、false来控制是否要更新视图
    </li>
    <li>
      willUpdate()：在更新之前执行，在这方法中可以执行一些属性设置用于更新时使用
    </li>
    <li>update()：更新DOM时r后，正常来说用不上这个方法</li>
    <li>render()：在update中调用，渲染模板</li>
    <li>
      firstUpdated()：在组件的DOM创建完成后执行一次性工作，在update之前调用（只会执行一次）
    </li>
    <li>
      updateComplete：这是一个属性，返回一个 Promise
      用于标识当前组件是否更新完成（不包含子组件是否更新完成）
      <br />
      如果返回 false 说明更新出现了异常
      <br />
      如果赖于组件整个后代树的更新完成，那么等待requestAnimationFrame通常是更好的选择，因为Lit的默认调度使用浏览器的微任务队列，该队列在动画帧之前被清空。这确保在requestAnimationFrame回调之前页面上所有的Lit更新都已完成。
    </li>
    <li>
      getUpdateComplete():要在完成updateComplete之前添加其它条件，请覆盖getUpdateComplete()方法。例如，实现等待子元素更新完成后再完成
      updateComplete。首先等待默认的
      super.getUpdateComplete()，然后等待任何其它状态
      <code>
        class MyElement extends LitElement { async getUpdateComplete() { await
        super.getUpdateComplete(); await this._myChild.updateComplete; } }
      </code>
    </li>
    <li>
      scheduleUpdate()
      在即将执行更新时被调用，默认情况下它会立即调用performUpdate()。覆盖它以延迟更新—此技术可用于解除主呈现/事件线程的阻塞。
      例如，下面的代码将更新安排在下一帧绘制之后进行，如果更新开销很大，则可以减少延迟
      <code>
        async scheduleUpdate() { await new Promise((resolve) =>
        setTimeout(resolve)); super.scheduleUpdate(); }
      </code>
    </li>
    <li>
      performUpdate():调用performUpdate()来立即处理挂起的更新。通常不需要这样做，但在需要同步更新的极少数情况下可以这样做。(如果没有更新挂起，您可以调用requestUpdate()，然后调用performUpdate()来强制同步更新。)
    </li>
    <li>hasUpdated: 如果组件至少更新过一次，hasUpdated属性返回true</li>
  </ul>
</template>

<style scoped></style>
