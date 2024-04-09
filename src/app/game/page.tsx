"use client"

// TODO: MORE POINTS FOR CORRECT ANSWER STREAKS

import React, { useState, useEffect } from "react"

interface GameData {
    name: string
    questions: number
    limit: string
    category: string
    category_id: string
    score: number
}

const Page = () => {
    const [data, setData] = useState<GameData | null>(null)

    // ! TEST INFO TO NOT OVERLOAD SERVERS !
    const test_trivia_questions = {
        response_code: 0,
        results: [
            {
                type: "multiple",
                difficulty: "medium",
                category: "General Knowledge",
                question:
                    "What is the highest number of Michelin stars a restaurant can receive?",
                correct_answer: "Three",
                incorrect_answers: ["Four", "Five", "Six"],
            },
            {
                type: "multiple",
                difficulty: "medium",
                category: "General Knowledge",
                question: "What is a dead mall?",
                correct_answer:
                    "A mall with high vacancy rates or low consumer foot traffic",
                incorrect_answers: [
                    "A mall with no stores",
                    "A mall that has been condemed",
                    "A mall after business hours",
                ],
            },
            {
                type: "multiple",
                difficulty: "easy",
                category: "General Knowledge",
                question: "Area 51 is located in which US state?",
                correct_answer: "Nevada",
                incorrect_answers: ["Arizona", "New Mexico", "Utah"],
            },
        ],
    }

    // ! DON'T TOUCH !
    useEffect(() => {
        const getGameData = () => {
            const currentGame = localStorage.getItem("current")

            if (currentGame) {
                setData(JSON.parse(currentGame) as GameData)
            }
        }

        getGameData()
    }, [])

    return (
        <div className="h-screen text-center">
            {data ? (
                <div>
                    <p className="mt-8">Category: {data.category}</p>
                    <div className="flex justify-around text-lg font-medium mt-8 mb-8">
                        <p>{data.name}</p>
                        <p>Score: {data.score}</p>
                        <p>Questions left: {data.questions}</p>
                    </div>

           
                </div>
            ) : (
                <div className="h-screen flex justify-center">
                    <a
                        href="/start"
                        className="text-lg underline text-blue-500 self-center"
                    >
                        No data available, click me to start!
                    </a>
                </div>
            )}
        </div>
    )
}

export default Page
