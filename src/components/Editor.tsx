import { useCallback } from 'react';
import * as Icons from 'lucide-react';
import classNames from 'classnames';
import MintButton from './MintButton';

import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
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


export function SimpleEditor() {
	const editor = useEditor({
		editorProps: {
			attributes: {
				class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
			},
		},
		extensions: [
			Heading.configure({
				levels: [1, 2, 3],
				HTMLAttributes: {
					class: ({ level }: { level: number }) => {
						switch (level) {
						case 1:
							return 'font-mono'
						case 2:
							return 'mt-8 md:mt-12 !leading-normal'
						case 3:
							return ''
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
		content: `<p>Type something...</p>`,
	}) as Editor;

	// const router = useRouter();
	// const [modalIsOpen, setIsOpen] = useState(false);
	// const [loading, setLoading] = useState(false);
	// const [url, setUrl] = useState<string>("");

	// const openModal = useCallback(() => {
	// 	setUrl(editor.getAttributes("link").href);
	// 	setIsOpen(true);
	// }, [editor]);



	/**
	const closeModal = useCallback(() => {
		setIsOpen(false);
		setUrl("");
	}, []);

	const saveLink = useCallback(() => {
		console.log(url);
		if (url) {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url, target: "_blank" })
				.run();
		} else {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
		}
		editor.commands.blur();
		console.log(editor.getHTML());
		closeModal();
	}, [editor, url, closeModal]);

	const removeLink = useCallback(() => {
		editor.chain().focus().extendMarkRange("link").unsetLink().run();
		closeModal();
	}, [editor, closeModal]);

	const changeURL = useCallback((e: any) => {
		setUrl(e.target.value);
	}, []);
	*/

	const toggleHeading = useCallback(
		(level: 1 | 2 | 3) => {
			editor.chain().focus().toggleHeading({ level }).run();
		},
		[editor]
	);

	const toggleBold = useCallback(() => {
		editor.chain().focus().toggleBold().run();
	}, [editor]);

	const toggleUnderline = useCallback(() => {
		editor.chain().focus().toggleUnderline().run();
	}, [editor]);

	const toggleItalic = useCallback(() => {
		editor.chain().focus().toggleItalic().run();
	}, [editor]);

	const toggleBlockquote = useCallback(() => {
		editor.chain().focus().toggleBlockquote().run();
	}, [editor]);

	const toggleCode = useCallback(() => {
		editor.chain().focus().toggleCode().run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<>
			<div className="">
				<div className='fixed top-8 left-0 px-8 md:px-12 flex flex-row items-center justify-between w-full'>
					<button
						onClick={() => console.log('back')}
						className="cursor-pointer border-black">
						<Icons.ArrowLeft />
					</button>

					<div>
						<MintButton />
					</div>
				</div>


				<BubbleMenu
					pluginKey="bubbleMenuText"
					className="bg-zinc-800 flex items-center min-w-max gap-2 p-2 rounded-md"
					tippyOptions={{ duration: 150 }}
					editor={editor}
					shouldShow={({
						from,
						to,
					}) => {
						// only show if range is selected.
						return from !== to;
					}}>
					<button
						className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc700"
						onClick={() => toggleHeading(1)}>
						<p className="text-white text-sm font-mono">H1</p>
					</button>
					<button
						className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc700"
						onClick={() => toggleHeading(2)}>
						<p className="text-white text-xs font-mono">H2</p>
					</button>
					<button
						className="pointer-cursor h-10 w-10 px-4 flex justify-center items-center rounded-md hover:bg-zinc700"
						onClick={() => toggleHeading(3)}>
						<p className="text-white text-xs font-mono">H3</p>
					</button>
					<button
						className={classNames(
							"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
							{
								"is-active": editor.isActive("link"),
							}
						)}
						onClick={() => console.log('open modal')}>
						<Icons.Link color="white" size={16}/>
					</button>
					<button
						className={classNames(
							"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
							{
								"is-active": editor.isActive("bold"),
							}
						)}
						onClick={toggleBold}>
						<Icons.Bold color="white" size={16}/>
					</button>
					<button
						className={classNames(
							"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
							{
								"is-active": editor.isActive("underline"),
							}
						)}
						onClick={toggleUnderline}>
						<Icons.Underline color="white" size={16}/>
					</button>
					<button
						className={classNames(
							"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
							{
								"is-active": editor.isActive("intalic"),
							}
						)}
						onClick={toggleItalic}>
						<Icons.Italic color="white" size={16}/>
					</button>
					<button
						className={classNames(
							"pointer-cursor flex justify-center items-center h-10 w-10 pt-4 rounded-md hover:bg-zinc700",
							{
								"is-active": editor.isActive("blockquote"),
							}
						)}
						onClick={toggleBlockquote}>
						<p className="text-white text-3xl font-extralight">
                            &apos;&apos;
						</p>
					</button>
					<button
						className={classNames(
							"pointer-cursor h-10 w-10 pl-3 pr-5 rounded-md hover:bg-zinc700",
							{
								"is-active": editor.isActive("code"),
							}
						)}
						onClick={toggleCode}>
						<Icons.Code color="white" size={16}/>
					</button>
				</BubbleMenu>

				<div className="mt-20 md:mt-0">
					<EditorContent editor={editor} />
				</div>
			</div>
		</>
	);
}
