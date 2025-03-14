'use client'

import { useState } from 'react'
import PostButton from '@/components/PostButton'
import { RevervEditor } from '../../components/Editor'

// Simple page that serves as a wrapper for the editor and the post button
// This is basically the editor rendering plus a custom header with a post button
// The post button is passed the editor content as a prop

export default function Write() {
	const [editorContent, setEditorContent] = useState('');

	const handleEditorChange = (content: string) => {
		setEditorContent(content);
	};

	return (
		<>
			<div className='flex flex-col py-16 md:py-32 px-2 md:px-80'>
				<div className='py-8 md:py-12'>
					<RevervEditor onEditorChange={handleEditorChange} showMenu={true} />
				</div>
				<PostButton editorContent={editorContent} />
			</div>
		</>
	)
}
