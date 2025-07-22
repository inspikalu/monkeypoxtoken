"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Zap, Wrench, BookOpen, Play, Coins, ImageIcon, Rocket, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Palette, Music, Gamepad2, Building, GraduationCap, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-10">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-slate-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.1),transparent_50%)]" />
      </div>

      <div className="text-center max-w-6xl relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Badge
            variant="outline"
            className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 px-4 py-2 text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            The Complete No-Code Metaplex Platform
          </Badge>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent"
        >
          Unlock Metaplex Power
          <br />
          <span className="text-white">Without Code</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-slate-300 mb-6 max-w-4xl mx-auto"
        >
          The Shopify for Solana creators. Build tokens, mint NFTs, and launch collections with the same tools powering
          99% of Solana's digital assets.
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-400 mb-12 max-w-3xl mx-auto"
        >
          No coding required. No technical barriers. Just powerful creation tools that turn your ideas into reality in
          minutes, not months.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold px-8 py-4 text-lg shadow-lg hover:shadow-yellow-400/25 transition-all duration-200"
          >
            Explore Tools
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800/50 px-8 py-4 text-lg bg-transparent"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-400/10 rounded-lg">
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Mint with Core</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Create next-gen NFTs with Metaplex Core - the new standard for digital assets on Solana
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-400/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Master MPL-404</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Create hybrid assets that seamlessly swap between fungible tokens and NFTs
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-400/10 rounded-lg">
                <Wrench className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Full Toolkit</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Access every Metaplex tool through intuitive interfaces - from tokens to candy machines
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


const creatorTypes = [
  {
    icon: Palette,
    title: "Artists & Designers",
    description: "Create and sell digital art without technical barriers",
    examples: ["NFT Collections", "Digital Art Drops", "Generative Art"],
  },
  {
    icon: Music,
    title: "Musicians & Creators",
    description: "Monetize your content with tokens and exclusive NFTs",
    examples: ["Music NFTs", "Fan Tokens", "Exclusive Content"],
  },
  {
    icon: Gamepad2,
    title: "Game Developers",
    description: "Build in-game economies with hybrid assets and tokens",
    examples: ["Game Items", "Character NFTs", "Reward Tokens"],
  },
  {
    icon: Building,
    title: "Brands & Businesses",
    description: "Launch loyalty programs and digital collectibles",
    examples: ["Loyalty NFTs", "Brand Tokens", "Digital Rewards"],
  },
  {
    icon: GraduationCap,
    title: "Educators",
    description: "Create certificates, badges, and educational content",
    examples: ["Course Certificates", "Achievement Badges", "Learning Tokens"],
  },
  {
    icon: Users,
    title: "Communities",
    description: "Build engaged communities with governance and utility tokens",
    examples: ["DAO Tokens", "Community NFTs", "Governance Systems"],
  },
]

export function CreatorFocused() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for <span className="text-yellow-400">Every Creator</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Whether you're an artist, musician, game developer, or entrepreneur, Moonlambo provides the tools you need
            to succeed in the Solana ecosystem.
          </p>
        </motion.div>

        {/* Creator Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatorTypes.map((creator, index) => (
            <motion.div
              key={creator.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/30 border-slate-700/50 hover:border-yellow-400/30 transition-all duration-300 h-full group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-yellow-400/10 rounded-xl group-hover:bg-yellow-400/20 transition-colors">
                      <creator.icon className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  <CardTitle className="text-white text-xl">{creator.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-base">{creator.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-300 mb-3">Popular Use Cases:</div>
                    {creator.examples.map((example, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                        <span className="text-slate-400 text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EducationCTA() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Learn While You <span className="text-yellow-400">Build</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Our educational hub doesn't just give you tools - it teaches you the concepts behind blockchain creation so
            you can make informed decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Educational Hub */}
          <motion.div initial={{ x: -20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
            <Card className="bg-slate-800/50 border-slate-700/50 h-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 rounded-xl">
                    <BookOpen className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Educational Hub</h3>
                    <p className="text-slate-400">Learn blockchain concepts through hands-on creation</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Interactive Tutorials</div>
                      <div className="text-slate-400 text-sm">Step-by-step guides for every tool</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Concept Explanations</div>
                      <div className="text-slate-400 text-sm">Understand the 'why' behind each feature</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Best Practices</div>
                      <div className="text-slate-400 text-sm">Learn from successful creators</div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/20">
                  Explore Learning Resources
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Portal */}
          <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
            <Card className="bg-slate-800/50 border-slate-700/50 h-full">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-400/10 rounded-xl">
                    <Users className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Community Portal</h3>
                    <p className="text-slate-400">Connect with fellow creators and get support</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Creator Showcases</div>
                      <div className="text-slate-400 text-sm">See what others are building</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Support Forums</div>
                      <div className="text-slate-400 text-sm">Get help from the community</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Play className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-white font-medium">Live Events</div>
                      <div className="text-slate-400 text-sm">Join workshops and AMAs</div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/20">
                  Join the Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const tools = [
  {
    name: "MPL-404 (Hybrid Assets)",
    description: "Create assets that swap between fungible tokens and NFTs",
    status: "available",
    icon: Zap,
    color: "text-green-400",
  },
  {
    name: "Token Metadata",
    description: "Build and manage fungible tokens with rich metadata",
    status: "available",
    icon: Coins,
    color: "text-green-400",
  },
  {
    name: "Core Assets",
    description: "Next-generation NFT standard with advanced features",
    status: "available",
    icon: ImageIcon,
    color: "text-green-400",
  },
  {
    name: "Candy Machine",
    description: "Launch NFT collections with customizable mint mechanics",
    status: "coming-soon",
    icon: Rocket,
    color: "text-yellow-400",
  },
  {
    name: "Bubblegum (Compressed NFTs)",
    description: "Create cost-effective compressed NFTs at scale",
    status: "coming-soon",
    icon: ImageIcon,
    color: "text-yellow-400",
  },
  {
    name: "Hydra (Fanout Wallets)",
    description: "Distribute revenue automatically to multiple wallets",
    status: "planned",
    icon: Coins,
    color: "text-slate-400",
  },
]

export function PlatformOverview() {
  return (
    <section className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20 mb-4">
            Complete Metaplex Integration
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Every Tool You Need,
            <span className="text-yellow-400"> Zero Code Required</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Access the entire Metaplex ecosystem through intuitive interfaces. From simple tokens to complex hybrid
            assets, we've got you covered.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-700/50 rounded-lg">
                        <tool.icon className={`h-5 w-5 ${tool.color}`} />
                      </div>
                      <Badge
                        variant={tool.status === "available" ? "default" : "secondary"}
                        className={
                          tool.status === "available"
                            ? "bg-green-400/10 text-green-400 border-green-400/20"
                            : tool.status === "coming-soon"
                              ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                              : "bg-slate-600/10 text-slate-400 border-slate-600/20"
                        }
                      >
                        {tool.status === "available"
                          ? "Available"
                          : tool.status === "coming-soon"
                            ? "Coming Soon"
                            : "Planned"}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-white text-lg">{tool.name}</CardTitle>
                  <CardDescription className="text-slate-400">{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">881M+</div>
            <div className="text-slate-400">Assets Minted via Metaplex</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">10.2M+</div>
            <div className="text-slate-400">Unique Signers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">$9.7B+</div>
            <div className="text-slate-400">Transaction Volume</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">99%</div>
            <div className="text-slate-400">of Solana NFTs use Metaplex</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-bold px-8 py-4 text-lg"
          >
            Start Creating Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
