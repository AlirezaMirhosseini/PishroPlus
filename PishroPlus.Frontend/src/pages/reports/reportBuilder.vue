<template>
	<div class="report-container">
		<h1>سلام گلیووو</h1>
	</div>
</template>

<script>


export default {
	name: 'ReportBuilder',
	props: {
		procedureName: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			reportData: null
		}
	},
	mounted() {
		console.log('Loading report:', this.$route.query.report)
	}
}
</script>