"use client"

// TODO: MORE POINTS FOR CORRECT ANSWER STREAKS
// TODO: RANDOMIZE ANSWER ORDER
// TODO: SHOW CORRECT ANSWER AFTER CLICKING, INCORRECT ALL RED

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
    const trivia_questions = {
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

    // ! DON'T TOUCH START !
    useEffect(() => {
        const getGameData = () => {
            const currentGame = localStorage.getItem("current")

            if (currentGame) {
                setData(JSON.parse(currentGame) as GameData)
            }
        }
        getGameData()
    }, [])

    function shuffle(array: any) {
        var currentIndex = array.length,
            temporaryValue,
            randomIndex

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex -= 1

            temporaryValue = array[currentIndex]
            array[currentIndex] = array[randomIndex]
            array[randomIndex] = temporaryValue
        }

        return array
    }
    // ! DON'T TOUCH END !

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const renderQuestion = () => {
        if (data && data?.questions > 0) {
            if (trivia_questions) {
                const correct_answer =
                    trivia_questions["results"][data?.questions - 1]
                        .correct_answer
                const allAnswers = [
                    ...trivia_questions["results"][data?.questions - 1]
                        .incorrect_answers,
                    correct_answer,
                ]

                const handleAnswerClick = (answer: string) => {
                    setSelectedAnswer(answer)
                    if (answer === correct_answer) {
                        const currentGameString =
                            localStorage.getItem("current")
                        if (currentGameString) {
                            const currentGame = JSON.parse(currentGameString)
                            currentGame.score += 1000
                            currentGame.questions -= 1
                            localStorage.setItem("current", JSON.stringify(currentGame))
                        }

                        // TODO: restart renderQuestion()
                    }
                }

                return (
                    <div className="font-medium">
                        <div className="flex flex-wrap justify-around mb-8">
                            <p>Score: {data.score}</p>
                            <p>Questions left: {data.questions}</p>
                        </div>
                        <p className="mb-8 ">
                            {
                                trivia_questions["results"][data?.questions - 1]
                                    .question
                            }
                        </p>
                        <div className="flex flex-col justify-center text-center">
                            {allAnswers.map((answer: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerClick(answer)}
                                    className="text-center bg-neutral-700 p-2 m-auto mb-8 rounded-lg w-60"
                                    style={{
                                        backgroundColor:
                                            selectedAnswer === answer
                                                ? selectedAnswer ===
                                                  correct_answer
                                                    ? "green"
                                                    : "red"
                                                : "",
                                        color:
                                            selectedAnswer === answer
                                                ? selectedAnswer ===
                                                  correct_answer
                                                    ? "white"
                                                    : "white"
                                                : "",
                                    }}
                                    disabled={selectedAnswer !== null}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <div className="h-screen text-center">
            {data ? (
                <div>
                    <p className="mt-8 font-medium">Category: {data.category}</p>
                    <div className="flex justify-around text-lg font-medium mt-8 mb-8">
                        <p>{data.name}</p>
                    </div>
                    <div>
                        {data?.questions > 0 ? (
                            renderQuestion()
                        ) : (
                            <div>{/* Code for no questions here */}</div>
                        )}
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
