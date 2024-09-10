'use client'

import BlurFade from "@/components/magicui/blur-fade";
import { useRouter } from 'next/navigation';

const posts = [
	{
		key: 1,
		title: "5 Unexpected Benefits of Daily Meditation",
		content: "Discover how sitting still can move your life forward"
	},
	{
		key: 2,
		title: "The Art of Sourdough: A Beginner's Guide to Baking Bread",
		content: "Knead, rise, and bake your way to crusty perfection"
	},
	{
		key: 3,
		title: "Why Your Houseplants Keep Dying (And How to Save Them)",
		content: "Turn your black thumb green with these expert tips"
	},
	{
		key: 4,
		title: "Minimalism vs. Maximalism: Finding Your Personal Style",
		content: "Navigating the spectrum between 'less is more' and 'more is more'"
	},
	{
		key: 5,
		title: "The Hidden History of Your Favorite Childhood Snacks",
		content: "Unwrapping the surprising origins of your lunchbox treats"
	},
	{
		key: 6,
		title: "Digital Detox: I Gave Up Social Media for a Month, Here's What Happened",
		content: "My journey from constant scrolling to real-world connections"
	},
	{
		key: 7,
		title: "Ethical Fashion: How to Build a Sustainable Wardrobe on a Budget",
		content: "Look good, feel good, and do good without breaking the bank"
	},
	{
		key: 8,
		title: "The Science Behind Power Naps: Boost Your Productivity in 20 Minutes",
		content: "Harness the power of strategic snoozing for peak performance"
	},
	{
		key: 9,
		title: "From Couch to 5K: My Journey as a Reluctant Runner",
		content: " How I traded Netflix marathons for actual marathons"
	},
	{
		key: 10,
		title: "Fermentation Nation: Exploring the World of Homemade Kombucha",
		content: "Brew your way to better gut health with this fizzy elixir"
	},
]


export default function PostList() {
	const router = useRouter();

	const handleRedirect = (username: string, postId: string) => {
		router.push(`/${username}/${postId}`);
	}

	return (
		<div className="flex flex-col py-20 px-8 md:px-80 ">
			<h1 className="mb-6 text-gray-700">Latest</h1>
			{
				posts.map((i, index) => {
					return (
						<BlurFade delay={0.1 + index * 0.1}>
							<div
								key={i.key}
								onClick={() => handleRedirect('hugosanchez', i.key.toString())}
								className="border-t border-black py-6 md:p-8 cursor-pointer">
								<h2 className="text-xl md:text-2xl font-medium font-serif">{i.title}</h2>
								<p className="text-black  hidden md:block md:py-1">{i.content}</p>
								<p className="text-gray-500 text-sm">@hugosanchez</p>
							</div>
						</BlurFade>
					)

				})
			}
		</div>
	);
}
