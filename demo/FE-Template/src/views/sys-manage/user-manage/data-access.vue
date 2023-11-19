<template>
	<div
		class="global-flex"
		style="height: 100%"
	>
		<div class="left">
			<div class="title">{{ authName }}</div>
			<div class="c-form">
				<div class="filter-item">
					<el-input
						v-model="filterCode"
						placeholder="请输入关键字"
						clearable
					></el-input>
				</div>
				<div
					class="checkbox-box"
					v-if="!single"
				>
					全选
					<el-checkbox
              style="margin-left: 4px"
              :value="checkedAll"
              @change="changeAll"
					/>
				</div>
			</div>
			<div class="list">
				<div
					v-for="(item, index) in filterList"
					:key="index"
					class="list-item"
				>
					<el-checkbox
						v-model="item.checked"
						@change="single ? changeItem(item.code) : null"
					>
						<span class="item-label global-text-ellipsis">{{ item.text }}</span>
					</el-checkbox>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="title">
				已授权<span class="global-primary">({{ checkedList.length }}/{{ list.length }})</span>
			</div>
			<div class="c-form">
				<div class="user-info">
					授权用户：<span>{{ tarName }}</span>
				</div>
			</div>
			<div class="list">
				<div
					v-for="(item, index) in checkedList"
					:key="index"
					class="selected-item global-flex"
				>
					<div class="value global-text-ellipsis">{{ item.text }}</div>
					<div class="icon">
						<OperateItem
							@click.native="handlerMove(item)"
							noIcon
							type="del"
							text="移除"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'dataAccess',
	props: {
		list: Array,
		selected: Array,
		tarName: String,
		authName: String,
		single: Boolean,
	},
	data() {
		return {
			filterCode: '',
			accessList: [],
			checkedAll: false,
		};
	},
	computed: {
		checkedList() {
			return this.accessList.filter((item) => item.checked);
		},
		filterList() {
			if (!this.filterCode) {
				return this.accessList;
			}
			return this.accessList.filter((item) => item.text.indexOf(this.filterCode) > -1);
		},
	},
	watch: {
		accessList: {
			handler: function (value) {
				this.checkedAll = !value.find((item) => !item.checked);
			},
			deep: true,
		},
		list() {
			this.initData();
		},
	},
	methods: {
		changeItem(code) {
			this.accessList.forEach((item) => {
				if (item.code !== code) {
					item.checked = false;
				}
			});
		},
		changeAll(val) {
			this.checkedAll = val;
			this.accessList.forEach((item) => {
				item.checked = val;
			});
		},
		handlerMove(item) {
			item.checked = false;
		},
		async initData() {
			let obj = {};
			for (let i of this.selected) {
				obj[i] = true;
			}
			this.accessList = this.list.map((item) => ({
				...item,
				checked: obj[item.code] || false,
			}));
		},
		getChecked() {
			return this.accessList.filter((item) => item.checked);
		},
	},
	mounted() {
		this.initData();
	},
};
</script>

<style scoped lang="scss">
$--border-color-base: #eee;
$--color-primary: #225cee;
.title {
	border-bottom: solid 1px $--border-color-base;
	padding-bottom: 10px;
	margin-bottom: 10px;
	padding-right: 16px;
	font-size: 15px;
	font-weight: bold;
}

.left {
	//display: inline-block;
	width: 50%;
	border-right: solid 1px $--border-color-base;
	flex-direction: column;
	display: flex;
	.title {
		padding-right: 16px;
	}
	.data {
		padding-right: 16px;
		flex: 1;
	}
}
.right {
	width: 50%;
	flex-direction: column;
	display: flex;
	.title {
		padding-left: 16px;
	}
	.data {
		padding-left: 16px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
}

.c-form {
	display: flex;
	align-items: center;
	margin-bottom: 10px;
	.filter-item {
		width: 100%;
		flex: 1;
		display: inline-block;
	}
	.checkbox-box {
		vertical-align: bottom;
		margin-left: 20px;
		width: 60px;
		flex-shrink: 0;
    display: flex;
    align-items: center;
	}
}

.user-info {
	height: 32px;
	align-items: center;
	display: flex;
	padding: 0 10px;
	span {
		color: $--color-primary;
	}
}

.list {
	//height: 300px;
	flex: 1;
	overflow: auto;
}
.list-item,
.selected-item {
	padding: 10px 10px;
	&:hover {
		background: #ecedf0;
	}
}
::v-deep(.list-item) {
  .el-checkbox {
    display: flex;
    align-items: center;
  }
	.item-label {
		max-width: 200px;
	}
}
.selected-item {
	.value {
		flex: 1;
		width: 200px;
	}
	.icon {
		width: 50px;
		flex-shrink: 0;
		text-align: right;
	}
}
</style>
