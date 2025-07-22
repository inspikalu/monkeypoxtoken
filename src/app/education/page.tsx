"use client";
import { Button } from "@/components/ui/button";
import { FaYoutube, FaDiscord, FaBook, FaGraduationCap, FaCircleQuestion, FaUsers, FaStar, FaRocket, FaRoad, FaNewspaper, FaCirclePlay, FaFilePdf, FaArrowRight } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function EducationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#111827] to-gray-900 py-12 px-4 sm:px-8 lg:px-24">
            <div className="max-w-6xl mx-auto space-y-16">
                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">Educational Hub & Community Portal</h1>
                    <p className="text-gray-400 text-lg">Learn, connect, and grow with the Moonlambo community.</p>
                </div>

                {/* Learning Center */}
                <section className="grid md:grid-cols-3 gap-8">
                    {/* Tutorials */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-yellow-400/10">
                        <div className="flex items-center gap-3 text-yellow-400">
                            <FaBook className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Tutorials</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            Dive into easy-to-follow tutorials for every Metaplex tool. Start with "Minting Your First NFT with Core" or "Creating Hybrid Assets with MPL-404." Each guide includes screenshots, video links (available on our YouTube channel), and hands-on exercises. Check back as we add tutorials for Bubblegum v2, Fusion, and more!
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 w-full">
                            <Button variant="secondary" className="flex items-center gap-2 w-full"><FaYoutube /> Watch on YouTube</Button>
                            <Button variant="outline" className="flex items-center gap-2 w-full"><FaFilePdf /> Download PDF</Button>
                        </div>
                    </motion.div>
                    {/* Beginner Bootcamp */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-yellow-400/10">
                        <div className="flex items-center gap-3 text-yellow-400">
                            <FaGraduationCap className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Beginner Bootcamp</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            New to Solana or blockchain? Our Bootcamp covers the basics: setting up a Phantom wallet, funding with SOL, and understanding NFTs. Complete the 3-part series to earn a beginner badge and unlock exclusive tips. Start with Lesson 1: "What is Metaplex?"
                        </div>
                        <Button variant="default" className="mt-2 flex items-center gap-2 w-full"><FaArrowRight /> Enroll Today</Button>
                    </motion.div>
                    {/* FAQ & Glossary */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-yellow-400/10">
                        <div className="flex items-center gap-3 text-yellow-400">
                            <FaCircleQuestion className="h-6 w-6" />
                            <h2 className="text-xl font-bold">FAQ & Glossary</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            Got questions? Find answers to "How do I connect my wallet?" or "What are compressed NFTs?" Our FAQ is updated weekly. Need definitions? Check our Glossary for terms like "Candy Machine" or "Token Auth Rules." Suggest a question or term via our forum!
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 w-full">
                            <Button variant="secondary" className="flex items-center gap-2 w-full"><FaBook /> Browse FAQ</Button>
                            <Button variant="outline" className="flex items-center gap-2 w-full"><FaBook /> Search Glossary</Button>
                        </div>
                    </motion.div>
                </section>

                {/* Community Space */}
                <section className="grid md:grid-cols-3 gap-8">
                    {/* Forum */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-purple-400/10">
                        <div className="flex items-center gap-3 text-purple-400">
                            <FaUsers className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Forum</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            Join our vibrant Discord community to ask questions, share projects, and get real-time support. From troubleshooting to brainstorming, our members (over 500 active users!) are here to help. New topic? Start a thread today!
                        </div>
                        <Button variant="secondary" className="flex items-center gap-2 w-full"><FaDiscord /> Join Discord</Button>
                    </motion.div>
                    {/* Creator Showcases */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-purple-400/10">
                        <div className="flex items-center gap-3 text-purple-400">
                            <FaStar className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Creator Showcases</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            Discover inspiring projects built on Moonlambo. Check out "Pixel Pioneers," a gaming loot box using MPL-404, or "SolArt Collective," a token-NFT swap success. Apply to showcase your work and get featured with marketing support!
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 w-full">
                            <Button variant="secondary" className="flex items-center gap-2 w-full"><FaRocket /> View Showcases</Button>
                            <Button variant="outline" className="flex items-center gap-2 w-full"><FaArrowRight /> Submit Project</Button>
                        </div>
                    </motion.div>
                    {/* Creator Program */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-purple-400/10">
                        <div className="flex items-center gap-3 text-purple-400">
                            <FaGraduationCap className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Creator Program</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            Join our Creator Program to receive grants, marketing help, and networking opportunities. Successful creators like "NFT Innovator" have launched with us. Open to all—apply with your project idea by July 31, 2025.
                        </div>
                        <Button variant="default" className="flex items-center gap-2 w-full"><FaArrowRight /> Apply Now</Button>
                    </motion.div>
                </section>

                {/* MPL-404 Spotlight */}
                <section className="grid md:grid-cols-2 gap-8">
                    {/* Overview */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gradient-to-br from-yellow-400/10 to-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-yellow-400/20">
                        <div className="flex items-center gap-3 text-yellow-400">
                            <FaRocket className="h-6 w-6" />
                            <h2 className="text-xl font-bold">MPL-404 Overview</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            MPL-404 is Moonlambo’s flagship feature, blending fungible and non-fungible assets for dynamic experiences. Perfect for gaming loot boxes, token utilities, or DeFi innovations. Learn how it swaps 100 tokens for an NFT seamlessly. Launched in Q3 2025!
                        </div>
                        <Button variant="secondary" className="flex items-center gap-2 w-full"><FaBook /> Read Full Guide</Button>
                    </motion.div>
                    {/* Demo */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gradient-to-br from-yellow-400/10 to-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-yellow-400/20">
                        <div className="flex items-center gap-3 text-yellow-400">
                            <FaCirclePlay className="h-6 w-6" />
                            <h2 className="text-xl font-bold">MPL-404 Demo</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            Test MPL-404 on our devnet sandbox. Create a hybrid asset, swap tokens, and explore use cases like trait re-rolling. No risk, no cost—just pure creativity. Available 24/7 until August 15, 2025, for feedback.
                        </div>
                        <Button variant="default" className="flex items-center gap-2 w-full"><FaArrowRight /> Launch Demo</Button>
                    </motion.div>
                </section>

                {/* Updates & Blog */}
                <section className="grid md:grid-cols-2 gap-8">
                    {/* Roadmap Tracker */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-blue-400/10">
                        <div className="flex items-center gap-3 text-blue-400">
                            <FaRoad className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Roadmap Tracker</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            Track our progress! Q3 2025 brings MPL-404, Token Metadata, and Core Assets. Q4 2025 adds Candy Machine and Bubblegum. See milestones like "10,000 users" and adjust expectations based on community input. Last updated: July 22, 2025, 06:18 PM WAT.
                        </div>
                        <Button variant="secondary" className="flex items-center gap-2 w-full"><FaBook /> View Full Roadmap</Button>
                    </motion.div>
                    {/* News */}
                    <motion.div whileHover={{ y: -4, scale: 1.03 }} className="bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-blue-400/10">
                        <div className="flex items-center gap-3 text-blue-400">
                            <FaNewspaper className="h-6 w-6" />
                            <h2 className="text-xl font-bold">News</h2>
                        </div>
                        <div className="text-gray-300 text-sm flex-1">
                            Catch the latest! We hit 1,000 users this week and partnered with Solana Labs. Follow @moonlambo on Twitter for live updates. Next big reveal: Hydra tools in Q1 2026. Subscribe for email alerts!
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 w-full">
                            <a href="https://x.com/moonlamboe" target="_blank" rel="noopener noreferrer" className="w-full">
                                <Button variant="secondary" className="flex items-center gap-2 w-full"><FaArrowRight /> Follow @moonlambo</Button>
                            </a>
                            <Button variant="outline" className="flex items-center gap-2 w-full"><FaBook /> Subscribe</Button>
                        </div>
                    </motion.div>
                </section>
            </div>
        </div>
    );
}