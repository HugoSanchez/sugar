"use client";

import Link from 'next/link';
import Header from '@/components/Header';
export default function Home() {
	return (
		<>
			<Header>
				<Link
					href="/read"
					className="text-black text-md hover:opacity-80">
				read
				</Link>
				<Link
					href="/write"
					className="text-black text-md hover:opacity-80">
				write
				</Link>
			</Header>

			<div className="flex flex-col py-32 md:py-52 px-8 md:px-80 ">
				<h1 className="text-3xl md:text-6xl">
				Introducing <strong>reverv.xyz</strong>, a minimal onchain publishing platform.
				</h1>
				<p className=" mt-8 md:mt-12 !leading-loose">
				It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of &ldquo;de Finibus Bonorum et Malorum&rdquo; (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, &ldquo;Lorem ipsum dolor sit amet..&rdquo;, comes from a line in section 1.10.32.
				</p>
				<div className="flex flex-row w-full justify-between md:justify-start md:gap-4 mt-8 md:mt-12">
					<Link
						href="/read"
						className="text-black font-medium text-lg hover:opacity-60 md:mr-4 py-2 px-4">
					Read.
					</Link>
					<Link
						href="/write"
						className="text-black font-medium text-lg hover:opacity-60  md:mr-4 py-2 px-4">
					Write.
					</Link>
					<button className="text-emerald-600 font-medium text-lg hover:opacity-60 md:mr-4 py-2 px-4">
					Mint.
					</button>
				</div>
			</div>
		</>
	);
}
