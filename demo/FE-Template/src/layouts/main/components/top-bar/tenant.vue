<template>
	<div class="tenant-wrap">
		<div
			class="top-bar-user-container"
			@click="openDialog"
		>
			<div class="user-text">{{ curTenantInfo.name }}</div>
			<i class="el-icon-caret-bottom"></i>
		</div>
		<c-dialog
			title="切换租户"
			:visible.sync="dialogVisible"
      @cancle="cancelDialog('dialogVisible')"
		>
			<div
				style="margin-bottom: 8px"
				class="fw-500"
			>
				当前租户：<span class="light">{{ curTenantInfo.name }}</span>
			</div>
			<div
				class="line30"
				style="color: #999; margin-bottom: 8px"
			>
        请选择要切换的租户
			</div>
			<div style="min-height: 150px; max-height: 250px; overflow: auto">
				<el-tree
					:indent="12"
					highlight-current
					check-on-click-node
					:expand-on-click-node="false"
					@node-click="handleNodeClick"
					ref="treeRef"
					class="cur-tree"
					default-expand-all
					:data="tenantList"
					node-key="code"
					:props="{ label: 'name' }"
				>
          <template #default="{ node, data }">
            <div
                class="line"
            >
              <div
                  class="global-flex"
                  style="align-items: center"
              >
                <div
                    class="radio"
                    v-if="!(data.children && data.children.length)"
                ></div>
                {{ data.name }}
              </div>
              <el-radio
                  :model-value="currentNo"
                  :label="data.code"
                  style="margin-right: 0; line-height: 30px"
              >&nbsp;</el-radio
              >
            </div>
          </template>
				</el-tree>
			</div>
      <template #footer>
        <div class="dialog-footer">
          <c-button
              @click="dialogVisible = false"
              size="small"
              :loading="loading"
          >
            取消
          </c-button>
          <c-button
              type="primary"
              size="small"
              @click="switchFn"
              :loading="loading"
          >
            确认
          </c-button>
        </div>
      </template>

		</c-dialog>
	</div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { userStore } from '@/stores/user'

export default {
	name: 'header-share-center',
	computed: {
		...mapState(userStore, ['tenantList', 'curTenantInfo']),
	},
	data() {
		return {
			loading: false,
			dialogVisible: false,
			currentNo: '',
		};
	},
	methods: {
		...mapActions('user', ['SHARE_CENTER_LIST', 'SWITCH_SHARE_CENTER']),
    cancelDialog(val){
      this[val] = false
    },
		handleNodeClick(data) {
			this.currentNo = data.code;
		},
		openDialog() {
			this.currentNo = (this.curTenantInfo || {}).code || '';
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs.treeRef.setCurrentKey(this.currentNo);
			});
		},
		async switchFn() {
			this.currentNo = this.$refs.treeRef.getCurrentKey();
			this.loading = true;
			this.loading = false;
      setTimeout(() => {
        window.location.reload();
      }, 500);
		},
	},
};
</script>

<style lang="scss" scoped>
.top-bar-user-container {
	color: #141222;
	position: relative;
	display: flex;
	align-items: center;
	padding: 0 10px 0 12px;
	cursor: pointer;
	.user-icon {
		width: 16px;
		height: 16px;
	}
	.user-text {
		margin-left: 6px;
		margin-right: 8px;
	}
	.el-icon-caret-bottom {
		font-size: 12px;
	}
}
.line {
	width: 100%;
	color: #141222;
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	text-shadow: 0 0 0.25px currentcolor;
	.radio {
		width: 3px;
		height: 3px;
		background: #141222;
		border-radius: 3px;
		margin-right: 8px;
	}
	&.act {
		color: $--color-primary;
		.radio {
			background: $--color-primary;
		}
	}
}
.light {
	color: $--color-primary;
}
::v-deep(.cur-tree) {
  .el-tree-node__expand-icon:not(.is-leaf) {
    color: #141222;
  }
  .el-tree-node__content {
    border-radius: 8px;
    background: rgba(242, 244, 247, 0.5);
    margin-bottom: 4px;
    color: #141222;
    height: 40px;
    line-height: 40px;
  }
  &.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: rgba(242, 244, 247, 0.5);
    .el-tree-node__expand-icon:not(.is-leaf) {
      color: $--color-primary;
    }
    .line {
      color: $--color-primary;
    }
    .radio {
      background: $--color-primary;
    }
  }
}
</style>
