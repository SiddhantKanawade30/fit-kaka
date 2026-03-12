"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"
import { useState, useEffect } from "react"

const foodExamples = [
  "Eggs and toast",
  "100 g chicken",
  "200 g Paneer",
]

export default function FeaturesPage() {
  const [typewriterText, setTypewriterText] = useState("")
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  useEffect(() => {
    const currentFood = foodExamples[currentFoodIndex]

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentFood.length) {
          setTypewriterText(currentFood.substring(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        } else {
          setTimeout(() => setIsDeleting(true), 1000)
        }
      } else {
        if (charIndex > 0) {
          setTypewriterText(currentFood.substring(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        } else {
          setIsDeleting(false)
          setCurrentFoodIndex((prev) => (prev + 1) % foodExamples.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, currentFoodIndex])

  const features = [
    {
      title: "Chat Nutrition Tracking",
      description: "Tell FIT KAKA what you ate in plain text and it instantly analyzes calories, macros, and nutritional value for you."
    },
    {
      title: "Photo Meal Analysis",
      description:
        "Just snap a picture of your food and FIT KAKA will detect the items and estimate calories and nutrients automatically.",
      image: "/feature2.png"
    },
    {
      title: "Smart Nutrition Dashboard",
      description:
        "Track daily calories, macro breakdown, meal history, and progress with a simple and organized interface.",
      image: "/images/team-preview.png"
    }
  ]

  const cards = [
    "/fc1.jpeg",
    "/fc2.jpeg",
    "/fc3.jpeg"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [cards.length])

  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h1 className="text-4xl font-semibold text-gray-900">
          In Built{" "}
        <span className="bg-gradient-to-r from-[#075e54] via-[#128c7e] to-[#25d366] bg-clip-text text-transparent">
          AI Integration
        </span>
        </h1>

        <p className="mt-4 text-gray-500 text-lg max-w-3xl mx-auto">
          With AI booming each passing day, we've made sure that we integrate AI
          to best way we can, making nutrition tracking seamless and intelligent.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-10 mt-16">

          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-[#fafafa] rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all min-h-[440px]"
            >
              <CardContent className="p-0 flex flex-col h-full">

                {/* FIRST CARD – WHATSAPP DEMO */}
                {index === 0 ? (
                  <div className="bg-[#ece5dd] border border-gray-200 rounded-xl h-[240px] flex flex-col overflow-hidden mb-6">

                    {/* Header */}
                    <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3 w-full">

                      <div className="w-9 h-9 rounded-full bg-[#4f9a8b] flex items-center justify-center text-white text-sm font-semibold">
                        FK
                      </div>

                      <div className="flex flex-col leading-tight text-left">
                        <span className="text-sm font-semibold text-white">
                          FIT KAKA Bot
                        </span>
                        <span className="text-xs text-[#cfe9e4]">
                          online
                        </span>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-3 flex flex-col gap-3">

                      <div className="self-end bg-[#dcf8c6] px-3 py-2 rounded-lg text-sm shadow-sm">
                        Hi
                      </div>

                      <div className="self-start ml-1 bg-white px-3 py-2 rounded-lg text-sm shadow-sm max-w-[80%]">
                    Welcome to FIT KAKA.<br/>  What did you eat today?
                      </div>

                    </div>

                    {/* Input Field */}
                    <div className="bg-white rounded-full px-4 py-1.5 flex items-center gap-2 border border-gray-200 shadow-sm mx-3 mb-3">

                      <input
                        value={typewriterText}
                        readOnly
                        placeholder="Write a message..."
                        className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                      />

                      <Send className="w-4 h-4 text-gray-400" />

                    </div>
                  </div>
                ) : index === 2 ? (
                  /* THIRD CARD – STACKED CARD ANIMATION */
                  <div className="h-[240px] w-full overflow-hidden relative mb-6">
                    <div className="absolute inset-0">
                      {cards.map((cardPath, cardIndex) => {
                        return (
                          <div
                            key={cardIndex}
                            className="absolute inset-0 rounded-xl border-2 border-gray-300 shadow-md overflow-hidden"
                            style={{
                              opacity: cardIndex === currentCardIndex ? 1 : 0,
                              zIndex: cardIndex === currentCardIndex ? 1 : 0
                            }}
                          >
                            <Image
                              src={cardPath}
                              alt={`Card ${cardIndex + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (

                  /* OTHER CARDS */
                  <div className="bg-white border border-gray-200 rounded-xl p-4 h-[240px] flex items-center justify-center mb-6">
                    <Image
                      src={feature.image}
                      alt="Meal analysis preview"
                      width={400}
                      height={260}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                )}

                {/* TEXT */}
                <div className="mt-0 text-left flex-1">

                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      </div>
    </section>
  )
}