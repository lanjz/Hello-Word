<template>
	<div
		v-loading="isLoading"
		style="min-width: 200px"
		class="form-item-upload"
	>
		<div v-if="!disabled">
			<c-button
				style="width: 200px"
				class="global-relative"
				icon="el-icon-upload2"
				type="primary"
				v-if="!drag"
			>
				上传
				<input
					type="file"
					class="global-opacity-ab"
					@change="fileChange"
					:multiple="!isSingle"
					:accept="accept"
				/>
			</c-button>
			<div
				class="upload-drag"
				v-else
			>
				<CSvgIcon
					class="module-icon"
					name="upload"
				/>
				<div class="text-tip">
					<em>点击或将文件拖拽到这里上传</em>
					<div style="margin-top: 8px">{{ tips }}</div>
				</div>
				<input
					style="cursor: pointer"
					type="file"
					:multiple="!isSingle"
					class="global-opacity-ab"
					@change="fileChange"
					:accept="accept"
				/>
			</div>
		</div>
		<div class="file-list">
			<div
				class="item"
				v-for="(item, index) in fileList"
				:key="item.objectName || index"
			>
				<div
					class="name"
					@click.stop="download(item)"
				>
					<i
						class="el-icon-paperclip"
						style="margin-left: 10px"
					></i>
					{{ item.fileName }}
				</div>
				<div
					@click.stop="remove(item)"
					class="remove"
					v-if="!disabled"
				>
					<i class="el-icon-close"></i>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Loading } from 'element-ui';
import { fetch } from '@/utils/request';
import { makeUrlProtocolConsistent } from '@/utils/help';

export default {
	name: 'form-item-upload',
	props: {
		value: [String, Array],
		tips: String,
		limit: Number,
		accept: {
			type: String,
			default: () => '.xlsx,.xls',
		},
		disabled: Boolean,
		drag: Boolean,
	},
	data() {
		return {
			isLoading: false,
			fileList: [],
		};
	},
	watch: {
		value: {
			handler: function () {
				if (!this.value) {
					this.fileList = [];
					return;
				}
				const file = this.isSingle ? [this.value] : this.value;
				this.fileList = file.map((item) => ({ ...JSON.parse(item), fileMark: item }));
			},
			immediate: true,
		},
	},
	computed: {
		isSingle() {
			return !this.value || typeof this.value === 'string';
		},
	},
	methods: {
		async download(item) {
			this.isLoading = true;
			const { err, data } = await fetch({
				url: '/admin/commom/file/download/url/temp',
				method: 'post',
				data: {
					fileMark: item.fileMark,
				},
			});
			this.isLoading = false;
			if (!err) {
				window.open(makeUrlProtocolConsistent(data.data.tempUrl));
			}
		},
		getFormat(name) {
			const last = name.lastIndexOf('.');
			if (last < 0) {
				return '';
			}
			return name.substring(last);
		},
		async fileChange(e) {
			let file = this.isSingle ? [e.target.files[0]] : e.target.files;
			if (this.limit && file.length + this.fileList.length > this.limit) {
				this.$message({
					message: `附件数量不能超过${this.limit}个`,
					type: 'error',
				});
				return false;
			}
			for (let { size, name } of file) {
				const fileFormat = this.getFormat(name);
				if (!fileFormat || this.accept.indexOf(fileFormat) < 0) {
					this.$message({
						message: '文件类型错误，请重新上传',
						type: 'error',
					});
					return false;
				}
				if (parseInt(size) > 10485760) {
					this.$message({
						message: '文件大小超过限制，请重新上传',
						type: 'error',
					});
					return false;
				}
			}
			let loadingInstance = Loading.service({
				lock: true,
				body: true,
				text: '正在上传',
			});
			const uploadFetch = [];
			for (let f of file) {
				uploadFetch.push(
					fetch(
						{
							url: '/admin/commom/file/upload/ordinary',
							data: {
								file: f,
							},
							method: 'post',
						},
						{
							formData: true,
						}
					)
				);
			}
			let res = await Promise.all(uploadFetch);
			loadingInstance.close();
			e.target.value = '';
			if (!res[0].err) {
				this.$message({
					message: '上传成功',
					type: 'success',
				});
				if (this.isSingle) {
					this.fileList = [res[0].data.data];
				} else {
					res.forEach((item) => {
						this.fileList.push(item.data.data);
					});
				}
				this.doEmit();
			}
		},
		async remove(item, index) {
			this.isLoading = true;
			const { err } = await fetch({
				url: '/admin/commom/file/delete',
				method: 'post',
				data: {
					fileMark: item.fileMark,
				},
			});
			this.isLoading = false;
			if (!err) {
				this.$message({
					message: '删除成功',
					type: 'success',
				});
				this.fileList.splice(index, 1);
				this.doEmit();
			}
		},
		doEmit() {
			let res = this.fileList.map((item) => item.fileMark);
			this.$emit('input', this.isSingle ? res[0] || '' : res);
		},
	},
};
</script>

<style scoped lang="scss">
.file-list {
	margin-top: 10px;
	.item {
		display: flex;
		align-items: center;
		background: #fafafa;
		height: 32px;
		line-height: 32px;
		color: #333;
		margin-bottom: 4px;
		.name {
			flex: 1;
			cursor: pointer;
			color: $--color-primary;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.remove {
			cursor: pointer;
			margin-left: 20px;
			color: #999;
			margin-right: 8px;
		}
	}
}
.upload-drag {
	background-color: #fff;
	border: 2px dashed $--color-primary;
	border-radius: 6px;
	box-sizing: border-box;
	width: 100%;
	padding: 0 20px;
	text-align: center;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	padding-bottom: 20px;
	background: rgba(235, 241, 255, 0.4);
	/*	&:hover{
		border-color: $--color-primary;
	}*/
	.module-icon {
		font-size: 67px;
		color: $--color-primary;
		margin: 20px 0 16px;
	}
	.text-tip {
		color: #8f8f8f;
		font-size: 12px;
		text-align: center;
		word-break: break-all;
		line-height: 20px;
	}
	em {
		font-size: 14px;
		color: $--color-primary;
		font-style: normal;
	}
}
</style>
