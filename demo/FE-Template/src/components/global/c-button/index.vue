<template>
	<el-button
		v-if="showBtn"
		size="small"
		class="c-button"
		@click="handleClick"
		:loading="showLoading"
		v-bind="$attrs"
	>
		<span v-if="isExport && auth && auth">{{ auth.moduleName }}</span>
		<slot v-else></slot>
		<input
			type="file"
			class="global-opacity-ab"
			@change="fileChange"
			accept=".xlsx,.xls"
			v-if="!!uploadType"
		/>
	</el-button>
</template>

<script>
import { fetch } from '@/utils/request';
import { downloadFormStream } from '@/utils';
import { ElMessage } from 'element-plus';

export default {
	name: 'c-button',
  emits: ['click'],
	props: {
		exportUrl: String,
		importUrl: String,
		isAuth: Boolean,
		loading: Boolean,
		async: {
			type: Boolean,
			default: () => true,
		},
		auth: {},
		exportTemplateType: [String, Number],
		exportDataType: [String, Number],
		uploadType: [String, Number],
		exportParams: Object,
		filterParams: Function,
	},
	data() {
		return {
			isLoading: false,
		};
	},
	computed: {
		isExport() {
			return !!this.exportTemplateType || !!this.exportDataType || !!this.uploadType;
		},
		showLoading() {
			return this.isLoading || this.loading;
		},
		showBtn() {
			const hidden = this.auth && this.auth.hidden === 'Y';
			return this.isDev || !this.isAuth || (this.isAuth && !!this.auth && !hidden);
		},
		isDev() {
			// return false;
			return process.env.NODE_ENV === 'development';
		},
	},
	methods: {
		handleClick(e) {
			e.stopPropagation();
			if (this.exportTemplateType) {
				this.exportTempData();
				return;
			} else if (this.exportDataType) {
				this.exportData();
				return;
			}
			if (!this.$attrs.onClick && this.auth && this.auth.$listeners === 'Y') {
				this.$message.info(this.auth.$listeners);
			} else {
				if (this.auth && this.auth.isPredevFlag === 'Y' && this.auth.predeveTips) {
					ElMessage({
						message: this.auth.predeveTips,
						type: 'warning',
					});
				}
				this.$emit('click', e);
			}
		},
		async exportTempData() {
			this.isLoading = true;
			let { err, data } = await fetch({
				url: '/work/excel/downloadModule',
				method: 'post',
				data: {
					type: this.exportTemplateType,
				},
				responseType: 'arraybuffer',
			});
			this.isLoading = false;
			if (!err) {
				if (!data.data) {
					// 判断为异步导出
					this.successConfirm();
					return;
				}
				downloadFormStream(data);
				this.$message({
					message: '导出成功',
					type: 'success',
				});
			}
		},
		successConfirm() {
			const title = this.uploadType ? '导入' : '导出';
			this.$confirm(`数据${title}已提交，可点击前往“批导记录”查看${title}进度`, title, {
				confirmButtonText: '查看进度',
				cancelButtonText: '取消',
			})
				.then(async () => {
					this.$router.push('/my-download');
				})
				.catch(() => {});
		},
		async exportData() {
			let params = {
				type: this.exportDataType,
				params: this.exportParams || {},
			};
			if (this.filterParams) {
				params = this.filterParams('export', params);
			}
			this.isLoading = true;
			let { err, data } = await fetch({
				url: this.exportUrl || '/admin/exportDetail/exportFile',
				method: 'post',
				data: params,
				responseType: 'arraybuffer',
			});
			this.isLoading = false;
			if (!err) {
				if (!data.data) {
					// 判断为异步导出
					this.successConfirm();
					return;
				}
				downloadFormStream(data);
				this.$message({
					message: '导出成功',
					type: 'success',
				});
			}
		},
		async fileChange(e) {
			let params = {
				type: this.uploadType,
				userFile: e.target.files[0],
			};
			if (this.filterParams) {
				params = this.filterParams('import', params);
			}
			e.stopPropagation();
			let { err } = await fetch(
				{
					url: this.importUrl || '/admin/exportDetail/importFile',
					method: 'post',
					data: params,
				},
				{
					formData: true,
					loading: '正在上传',
				}
			);
			e.target.value = '';
			if (!err) {
				if (this.async) {
					this.successConfirm();
					return;
				}
				this.$message({
					message: '上传成功',
					type: 'success',
				});
				this.$emit('uploadSuccess');
			}
		},
	},
};
</script>

<style scoped lang="scss">
.c-button {
	font-size: 14px;
	font-family: PingFang SC;
	border-radius: 4px;
	flex-shrink: 0;
  font-weight: unset;
  &:not(.is-icon){
    min-width: 68px;
    height: 32px;
    padding: 0 22px;
  }
  &:not(.is-plain) {
    color: #43cdb2;
    border:solid 1px #00f2c3;
    &.el-button--primary, &.el-button--danger, &.el-button--warning {
      color: #fff;
      border: none;
    }
    &.el-button--primary {
      background-image: linear-gradient(to bottom left,#00f2c3,#0098f0,#00f2c3);
    }
    &.el-button--warning {
      background-image: linear-gradient(to bottom left, #e6a23c, #e7df90,#e6a23c);
    }
    &.el-button--danger {
      background-image: linear-gradient(to bottom left, #f56c6c, #c08ea6,#f56c6c);
    }
    &.is-disabled {
      background-image: none;
      border: solid 1px var(--el-color-primary-light-8);
      background: var(--el-color-primary-light-9);;
      color: #9ac0b0;
    }
    &:not(.is-disabled):hover{
      box-shadow: 2px 2px 6px rgba(0,0,0,.4);
    }
  }
  &.is-plain {
    background-image: none;
    &.is-disabled{
      color: #9ac0b0;
    }
  }
  &.is-round{
    border-radius: 20px;
  }
  ::v-deep([class*=el-icon] + span ) {
    margin-left: 0;
  }
}
</style>
