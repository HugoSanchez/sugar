import EditorMenu from './EditorMenu';
import PostButton from './PostButton';

import { useEditor, EditorContent, Editor } from "@tiptap/react";
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


export function RevervEditor({ onEditorChange }: { onEditorChange: (html: string) => void }) {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: 'tiptap prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
			},
		},
		extensions: [
			Placeholder.configure({
				placeholder: `Here's your editor. You're one click away from posting onchain. Go ahead, type something!`,
			}),
			Heading.configure({
				levels: [1, 2, 3],
				HTMLAttributes: {
					class: ({ level }: { level: number }) => {
						switch (level) {
						case 1:
							return 'font-mono'
						case 2:
							return 'mt-8 md:mt-12 !leading-normal'
						default:
							return ''
						}
					}
				},
			}),
			Document,
			History,
			Paragraph.configure({
				HTMLAttributes: {
					class: "!leading-loose",
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
		content: '',
		onUpdate: ({ editor }) => {
			onEditorChange(editor.getHTML());
		},
	}) as Editor;

	if (!editor) {
		return null;
	}

	return (
		<>
			<div className="">
				<div className="mt-14 pb-20 md:mt-0">
					<PostButton editorContent={editor.getHTML()}/>
					<EditorMenu editor={editor} />
					<EditorContent editor={editor} />
				</div>
			</div>
		</>
	);
}
