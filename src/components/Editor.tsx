import EditorMenu from './EditorMenu';
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { JSONContent } from '@tiptap/react';
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Blockquote from "@tiptap/extension-blockquote";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Placeholder from '@tiptap/extension-placeholder'

interface RevervEditorProps {
	onEditorChange: (content: string) => void;
	initialContent?: string;
	readOnly?: boolean;
}

export function RevervEditor({ onEditorChange, initialContent, readOnly = false }: RevervEditorProps) {
	const editor = useEditor({
		editable: !readOnly,
		editorProps: {
			attributes: {
				class: 'tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none [&>*:first-child]:mt-0',
			},
		},
		extensions: [
			Placeholder.configure({
				placeholder: readOnly ? '' : `Here's your editor. You're one click away from posting onchain. Go ahead, type something!`,
			}),
			Heading.configure({
				levels: [1, 2, 3],
				HTMLAttributes: {
					class: ({ level }: { level: number }) => {
						switch (level) {
						case 1:
							return 'mt-0'
						case 2:
							return 'mt-0'
						default:
							return 'mt-0'
						}
					}
				},
			}),
			Document,
			History,
			Paragraph.configure({
				HTMLAttributes: {
					class: "leading-loose mt-0",
				},
			}),
			Blockquote,
			Text,
			Link.configure({
				openOnClick: false,
			}),
			Bold,
			Underline,
			Italic,
			Strike,
			Code,
		],
		content: initialContent ? JSON.parse(initialContent) : '',
		onUpdate: ({ editor }) => {
			const json = editor.getJSON();
			onEditorChange(JSON.stringify(json));
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<>
			<div className="">
				{!readOnly && <EditorMenu editor={editor} />}
				<EditorContent editor={editor} />
			</div>
		</>
	);
}
