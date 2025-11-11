<template>
	<div class="rich-text-editor">
		<div class="editor-toolbar d-flex align-center mb-2">
			<v-btn
				variant="outlined"
				size="small"
				color="primary"
				prepend-icon="mdi-eye"
				@click="$emit('toggle-preview')"
				class="ms-2"
			>
				{{ previewMode ? 'ویرایش' : 'پیش‌نمایش' }}
			</v-btn>
			
			<v-spacer></v-spacer>
			
			<v-btn
				v-if="!previewMode"
				variant="text"
				size="small"
				color="primary"
				prepend-icon="mdi-format-clear"
				@click="clearFormat"
			>
				حذف قالب‌بندی
			</v-btn>
		</div>
		
		<div v-if="previewMode" class="preview-container pa-4">
			<div v-if="modelValue" v-html="modelValue" class="preview-content"></div>
			<div v-else class="text-grey">{{ placeholder }}</div>
		</div>
		
		<div v-else class="editor-wrapper">
			<QuillEditor
				ref="editor"
				v-model:content="content"
				:options="editorOptions"
				contentType="html"
				theme="snow"
				@update:content="updateContent"
				@ready="editorReady"
			/>
		</div>
		
		<div class="text-caption text-grey mt-2">
			از قابلیت پیش‌نمایش برای دیدن نتیجه نهایی استفاده کنید
		</div>
	</div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
	components: {
		QuillEditor,
	},
	
	props: {
		modelValue: {
			type: String,
			default: ''
		},
		previewMode: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: 'محتوا را وارد کنید...'
		}
	},
	
	emits: ['update:modelValue', 'toggle-preview'],
	
	data() {
		return {
			content: this.modelValue,
			editorOptions: {
				modules: {
					toolbar: [
						[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
						[{ 'size': ['small', false, 'large', 'huge'] }],
						['bold', 'italic', 'underline', 'strike'],
						[{ 'color': [] }, { 'background': [] }],
						[{ 'align': [] }],
						[{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
						[{ 'indent': '-1'}, { 'indent': '+1' }],
						['blockquote', 'code-block'],
						['link', 'image', 'video'],
						['clean']
					]
				},
				placeholder: this.placeholder,
				theme: 'snow',
				language: 'fa',
				defaultDirection: 'rtl'
			}
		};
	},
	
	watch: {
		modelValue(newVal) {
			if (newVal !== this.content) {
				this.content = newVal;
				this.setEditorContent(newVal);
			}
		}
	},
	
	methods: {
		editorReady(editor) {
			this.setEditorContent(this.modelValue);
		},
		
		setEditorContent(content) {
			if (this.$refs.editor) {
				this.$refs.editor.setHTML(content || '');
			}
		},

		updateContent(newContent) {
			this.$emit('update:modelValue', newContent);
		},
		
		clearFormat() {
			const editor = this.$refs.editor?.getQuill();
			if (editor) {
				const range = editor.getSelection();
				if (range) {
					editor.removeFormat(range.index, range.length);
				}
			}
		}
	}
};
</script>

<style scoped>
.rich-text-editor {
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
}

.editor-wrapper {
	border-radius: 4px;
	background-color: white;
}

.editor-wrapper :deep(.ql-container) {
	min-height: 250px;
	background-color: white;
}

.editor-wrapper :deep(.ql-editor) {
	min-height: 250px;
	font-family: inherit;
	direction: rtl;
	text-align: right;
}

.editor-wrapper :deep(.ql-toolbar) {
	border-bottom: 1px solid #e0e0e0;
	padding: 8px;
}

.editor-wrapper :deep(.ql-snow.ql-toolbar button:hover),
.editor-wrapper :deep(.ql-snow.ql-toolbar button.ql-active) {
	color: #1867C0;
}

.editor-wrapper :deep(.ql-snow.ql-toolbar button:hover .ql-stroke),
.editor-wrapper :deep(.ql-snow.ql-toolbar button.ql-active .ql-stroke) {
	stroke: #1867C0;
}

.editor-wrapper :deep(.ql-snow.ql-toolbar button:hover .ql-fill),
.editor-wrapper :deep(.ql-snow.ql-toolbar button.ql-active .ql-fill) {
	fill: #1867C0;
}

.editor-wrapper :deep(.ql-editor.ql-blank::before) {
	right: 15px;
	left: auto;
	text-align: right;
	color: #9e9e9e;
}

.preview-container {
	min-height: 250px;
	background-color: white;
	border: 1px solid #e0e0e0;
	border-radius: 4px;
	padding: 16px;
	overflow-y: auto;
}

.preview-content {
	direction: rtl;
	text-align: right;
}

.preview-content:empty::before {
	content: attr(data-placeholder);
	color: #9e9e9e;
}
</style>