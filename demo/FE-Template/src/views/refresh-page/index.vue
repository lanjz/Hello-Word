<script>
export default {
	name: 'refreshPage',
	created() {
		const { query } = this.$route;
		this.$router.replace(query.to);
	},
	render: function (h) {
		return h(); // avoid warning message
	},
};
</script>
