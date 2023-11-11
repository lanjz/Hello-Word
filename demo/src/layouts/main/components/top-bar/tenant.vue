<template>
	<div
		class="tenant-wrap"
		v-if="curTenant.tenantName"
	>
		<div class="align-center item-wrap">
			<i
				class="el-icon-sort"
				style="transform: rotate(90deg)"
			/>
			{{ curTenant.tenantName }}
		</div>
		<el-dialog
			title="切换租户"
			:visible.sync="dialogLesseeVisible"
			width="450px"
		>
			<div class="line30">
				当前租户：<span style="font-weight: bold">{{ curTenant.tenantName || '选择租户' }}</span>
			</div>
			<div
				class="line30"
				style="color: #c5c5c5"
			>
				如要切换租户，点击选择进入其他租户
			</div>
			<div
				v-for="item in tenantList"
				:key="item.tenantCode"
				class="lesseeLine"
			>
				<el-radio
					v-model="currentLesseeNo"
					:label="item.tenantCode"
					style="margin-right: 0; line-height: 30px"
					>{{ item.tenantName }}</el-radio
				>
			</div>
			<div
				slot="footer"
				class="dialog-footer"
			>
				<el-button
					@click="dialogLesseeVisible = false"
					size="small"
					:loading="loading"
				>
					取消
				</el-button>
				<el-button
					type="primary"
					size="small"
					@click="switchLesseeFn"
					:loading="loading"
				>
					保存
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
export default {
	name: 'header-tenant',
	computed: {
		...mapState('user', ['loginInfo', 'tenantList']),
		...mapGetters('user', ['curTenant']),
	},
	data() {
		return {
			currentLessee: '',
			lesseeList: [],
			loading: false,
			dialogLesseeVisible: false,
			currentLesseeNo: '',
		};
	},
	methods: {
		...mapActions('user', ['SWITCH_LESSEE']),
		openLesseeDialog() {
			this.currentLesseeNo = (this.curTenant || {}).tenantCode || '';
			this.dialogLesseeVisible = true;
		},
		// 点击切换多租户
		async switchLesseeFn() {
			this.loading = true;
			let { err } = await this['SWITCH_LESSEE'](this.currentLesseeNo);
			this.loading = false;
			if (!err) {
				this.$router.replace({
					path: '/',
				});
				window.location.reload();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.item-wrap {
	cursor: pointer;
}
.align-center {
	display: flex;
	align-items: center;
}
::v-deep {
	.el-dropdown {
		color: #a5abbe;
		cursor: pointer;
	}
}
.line30 {
	line-height: 30px;
}
.comp-list {
	max-height: 200px;
	overflow: auto;
}
.tenant-wrap {
	display: inline-block;
	font-size: 14px;
}
</style>
