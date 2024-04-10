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
    const [trivia_questions, setTrivia_questions] = useState({})

    useEffect(() => {
        const getQuestions = localStorage.getItem("questions")
        setTrivia_questions(JSON.parse(getQuestions || "{}"))

        const currentGame = localStorage.getItem("current")
        if (currentGame) {
            setData(JSON.parse(currentGame) as GameData)
        }
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
                    // @ts-ignore
                    trivia_questions["results"][data?.questions - 1]
                        .correct_answer
                const allAnswers = [
                    // @ts-ignore
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
                            localStorage.setItem(
                                "current",
                                JSON.stringify(currentGame)
                            )
                        }
                    } else {
                        const currentGameString =
                            localStorage.getItem("current")
                        if (currentGameString) {
                            const currentGame = JSON.parse(currentGameString)
                            currentGame.score -= 500
                            currentGame.questions -= 1
                            localStorage.setItem(
                                "current",
                                JSON.stringify(currentGame)
                            )
                        }
                    }
                    // TODO: refresh page after a timer
                    // TODO: add notification showing -500 or +1000
                    window.location.reload()
                }

                return (
                    <div className="font-medium">
                        <div className="flex flex-wrap justify-around mb-8">
                            <p>Score: {data.score}</p>
                            <p>Questions left: {data.questions}</p>
                        </div>
                        {/* @ts-ignore */}
                        <div
                            className="mb-8"
                            dangerouslySetInnerHTML={{
                                __html: `<p>${
                                    // @ts-ignore
                                    trivia_questions["results"][
                                        data?.questions - 1
                                    ].question
                                }</p>`,
                            }}
                        ></div>
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
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: `<p>${answer}</p>`,
                                        }}
                                    ></div>
                                </button>
                            ))}
                            <a href="/start" className="text-center bg-red-500 p-2 m-auto mt-20 rounded-lg w-60">Give up</a>
                        </div>
                    </div>
                )
            }
        }
    }

    return (
        <div className="h-screen text-center font-medium">
            {data ? (
                <div>
                    {data?.questions > 0 ? (
                        <div>
                            <p className="mt-8">Category: {data.category}</p>
                            <div className="flex justify-around text-lg font-medium mt-8 mb-8">
                                <p>{data.name}</p>
                            </div>
                            {renderQuestion()}
                        </div>
                    ) : (
                        <div>
                            <div className="h-screen flex flex-col justify-evenly">
                                <div className="flex flex-col justify-center text-center">
                                    <p className="mb-4">YOUR SCORE</p>
                                    <p>{data.name}</p>
                                    <p>{data.score}</p>
                                </div>
                                <a
                                    href="/start"
                                    className="text-lg underline text-blue-500 self-center"
                                >
                                    Click to play again!
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    )
}

export default Page
