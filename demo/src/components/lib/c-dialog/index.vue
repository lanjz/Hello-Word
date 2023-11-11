<template>
	<el-dialog
		v-bind="$attrs"
		@close="cancle"
		:size="width"
	>
		<div class="drawer-wrap">
			<slot name="top"></slot>
			<div
				class="content"
				:style="{
					padding: fullContent ? '0' : '0 20px',
					marginTop: fullContent ? '0' : '15px',
				}"
			>
				<slot></slot>
			</div>
			<div
				class="foot"
				v-if="!hideFoot"
			>
				<slot name="footer">
					<c-button
						v-if="isLook"
						:loading="loading"
						class="btn"
						@click="cancle"
					>
						关闭
					</c-button>
					<template v-else>
						<c-button
							:loading="loading"
							class="btn"
							@click="cancle"
						>
							取消
						</c-button>
						<c-button
							:loading="loading"
							class="btn"
							type="primary"
							@click="confirm"
						>
							{{ confirmBtnText }}
						</c-button>
					</template>
				</slot>
			</div>
		</div>
	</el-dialog>
</template>

<script>
export default {
	name: 'c-drawer',
	props: {
		fullContent: {
			type: Boolean,
			default: () => false,
		},
		loading: {
			type: Boolean,
			default: () => false,
		},
		hideFoot: {
			type: Boolean,
			default: () => false,
		},
		isLook: {
			type: Boolean,
			default: () => false,
		},
		width: {
			type: String,
			default: () => '400px',
		},
		confirmBtnText: {
			type: String,
			default: () => '保存',
		},
	},
	data() {
		return {};
	},
	computed: {},
	methods: {
		confirm() {
			this.$emit('confirm');
		},
		cancle() {
			this.$emit('cancle');
		},
	},
	destroyed() {},
	mounted() {},
};
</script>

<style scoped lang="scss">
::v-deep {
	.el-dialog .el-dialog__body {
		padding: 0;
	}
	.el-drawer__header {
		border-bottom: solid 1px #e2e2e2;
		padding: 14px 20px;
		margin-bottom: 0;
		color: #333;
		font-weight: bold;
	}
	.el-drawer__close-btn {
		font-size: 16px;
	}
}
.drawer-wrap {
	height: 100%;
	display: flex;
	flex-direction: column;
	.content {
		margin: 20px 24px 24px 24px;
		flex: 1;
		padding: 0 20px;
		overflow: auto;
		min-height: 0;
	}
	.foot {
		padding: 0 20px;
		height: 60px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		border-top: solid 1px #e2e2e2;
		.btn:not(:last-child) {
			//margin-right: 15px;
		}
	}
}
</style>
