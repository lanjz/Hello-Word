<template>
	<div class="tenant-wrap">
		<div
			class="top-bar-user-container"
			@click="openDialog"
		>
			<div class="user-text">{{ curShareCenter.shareCenterName }}</div>
			<i class="el-icon-caret-bottom"></i>
		</div>
		<el-dialog
			title="切换共享中心"
			:visible.sync="dialogVisible"
			width="450px"
		>
			<div
				style="margin-bottom: 8px"
				class="fw-500"
			>
				当前共享中心：<span class="light">{{ curShareCenter.shareCenterName }}</span>
			</div>
			<div
				class="line30"
				style="color: #999; margin-bottom: 8px"
			>
				如要切换共享中心，点击选择进入其他共享中心
			</div>
			<div style="width: 330px; min-height: 150px; max-height: 250px; overflow: auto">
				<el-tree
					:indent="12"
					highlight-current
					check-on-click-node
					:expand-on-click-node="false"
					@node-click="handleNodeClick"
					ref="treeRef"
					class="cur-tree"
					default-expand-all
					:data="shareCenterList"
					node-key="shareCenterCode"
					:props="{ label: 'shareCenterName' }"
				>
					<div
						slot-scope="{ data }"
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
							{{ data.shareCenterName }}
						</div>

						<el-radio
							:value="currentNo"
							:label="data.shareCenterCode"
							style="margin-right: 0; line-height: 30px"
							>&nbsp;</el-radio
						>
					</div>
				</el-tree>
			</div>
			<div
				slot="footer"
				class="dialog-footer"
			>
				<el-button
					@click="dialogVisible = false"
					size="small"
					:loading="loading"
				>
					取消
				</el-button>
				<el-button
					type="primary"
					size="small"
					@click="switchFn"
					:loading="loading"
				>
					确认
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { HOME_PATH } from '@/router/routes/constRoutes';

export default {
	name: 'header-share-center',
	computed: {
		...mapState('user', ['shareCenterList']),
		...mapGetters('user', ['curShareCenter']),
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
		handleNodeClick(data) {
			this.currentNo = data.shareCenterCode;
		},
		openDialog() {
			this.currentNo = (this.curShareCenter || {}).shareCenterCode || '';
			this.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs.treeRef.setCurrentKey(this.currentNo);
			});
		},
		async switchFn() {
			this.currentNo = this.$refs.treeRef.getCurrentKey();
			this.loading = true;
			let { err } = await this['SWITCH_SHARE_CENTER'](this.currentNo);
			this.loading = false;
			if (!err) {
				this.$router.replace(
					{
						path: HOME_PATH,
					},
					() => {}
				);
				setTimeout(() => {
					window.location.reload();
				}, 500);
			}
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
		color: #3355ff;
		.radio {
			background: #3355ff;
		}
	}
}
.light {
	color: #3355ff;
}
.cur-tree {
	::v-deep {
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
				color: #3355ff;
			}
			.line {
				color: #3355ff;
			}
			.radio {
				background: #3355ff;
			}
		}
	}
}
</style>
