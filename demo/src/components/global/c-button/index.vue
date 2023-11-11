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
import { Message } from 'element-ui';

export default {
	name: 'c-button',
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
			if (!this.$listeners.click && this.auth && this.auth.$listeners === 'Y') {
				this.$message.info(this.auth.$listeners);
			} else {
				if (this.auth && this.auth.isPredevFlag === 'Y' && this.auth.predeveTips) {
					Message({
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
	min-width: 68px;
	height: 32px;
	padding: 0 12px;
	flex-shrink: 0;
	&.el-button--primary {
		box-shadow: 0px 0px 2px 0px rgb(51 85 255 / 50%);
	}
	::v-deep {
		svg {
			position: relative;
			color: #abb0b9;
			margin-right: 6px;
			height: 16px;
			font-family: element-icons !important;
			speak: none;
			font-style: normal;
			font-weight: 400;
			font-variant: normal;
			text-transform: none;
			line-height: 1;
			vertical-align: baseline;
			display: inline-block;
			font-smoothing: antialiased;
			top: 2px;
		}
	}
	&:not(.el-button--text):not(.el-button--primary):not(.el-button--danger) {
		color: #141222;
	}
	&.el-button--primary.is-plain {
		&:not(.is-disabled) {
			background: #fff;
			border-color: $--color-primary;
			&:hover {
				color: $--color-primary;
				background-color: #ebeeff;
			}
			&:active,
			&:focus {
				color: $--color-primary;
			}
		}
	}
	&.el-button--danger.is-plain {
		&:not(.is-disabled) {
			background: #fff;
		}
		&:hover {
			color: $--color-danger;
			background-color: #ebeeff;
		}
		&:active,
		&:focus {
			color: $--color-danger;
		}
	}
}
.el-button.is-plain:hover,
.el-button.is-plain:focus {
	::v-deep {
		svg {
			color: $--color-primary;
		}
	}
}
</style>
