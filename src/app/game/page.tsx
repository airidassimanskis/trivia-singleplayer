"use client"

// TODO: SHOW CORRECT ANSWER: GREEN AFTER CLICKING, INCORRECT: ALL RED
// TODO: ACTUALLY GIVE +1000 POINTS FOR ANSWERING CORRECTLY

import React, { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface GameData {
    name: string
    questions: number
    limit: string
    category: string
    category_id: string
    score: number
}

const shuffleArray = (array: any[]) => {
    let shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledArray[i], shuffledArray[j]] = [
            shuffledArray[j],
            shuffledArray[i],
        ]
    }
    return shuffledArray
}

const Page = () => {
    const [data, setData] = useState<GameData | null>(null)
    const [triviaQuestions, setTriviaQuestions] = useState<any>(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
    const [allAnswers, setAllAnswers] = useState<string[]>([])

    useEffect(() => {
        const getQuestions = localStorage.getItem("questions")
        const parsedQuestions = JSON.parse(getQuestions || "{}")
        if (!parsedQuestions || Object.keys(parsedQuestions).length === 0) {
        } else {
            setTriviaQuestions(parsedQuestions)
        }

        const currentGame = localStorage.getItem("current")
        if (currentGame) {
            setData(JSON.parse(currentGame) as GameData)
        }
    }, [])

    useEffect(() => {
        if (
            triviaQuestions &&
            triviaQuestions.results &&
            triviaQuestions.results.length > currentQuestionIndex
        ) {
            const currentQuestion =
                triviaQuestions.results[currentQuestionIndex]
            const correctAnswer = currentQuestion.correct_answer
            let answers = [...currentQuestion.incorrect_answers, correctAnswer]
            setAllAnswers(shuffleArray(answers))
        }
    }, [triviaQuestions, currentQuestionIndex])

    const handleAnswerClick = async (answer: string) => {
        if (!data) return

        setSelectedAnswer(answer)
        // @ts-ignore
        const isCorrect = answer === data.correctAnswer
        let scoreChange
        if (isCorrect) {
            scoreChange = 1000
        } else {
            scoreChange = -500
        }
        const updatedData = {
            ...data,
            score: data.score + scoreChange,
            questions: data.questions - 1,
        }
        setData(updatedData)
        localStorage.setItem("current", JSON.stringify(updatedData))

        toast(isCorrect ? "+1000" : "-500", {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "colored",
        })

        // Do not shuffle again, just wait and move to the next question
        setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setSelectedAnswer(null) // Reset for the next question
        }, 1500)
    }

    const renderQuestion = () => {
        if (
            data &&
            triviaQuestions &&
            triviaQuestions.results &&
            triviaQuestions.results.length > currentQuestionIndex
        ) {
            const currentQuestion =
                triviaQuestions.results[currentQuestionIndex]
            const correctAnswer = currentQuestion.correct_answer

            return (
                <div className="font-medium">
                    <div className="flex flex-wrap justify-around mb-8">
                        <p>Score: {data.score}</p>
                        <p>Questions left: {data.questions}</p>
                    </div>
                    <div
                        className="mb-8"
                        dangerouslySetInnerHTML={{
                            __html: `<p>${currentQuestion.question}</p>`,
                        }}
                    ></div>
                    <div
                        className="flex flex-col justify-center text-center"
                        id="answers"
                    >
                        {allAnswers.map((answer: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerClick(answer)}
                                className={`text-center bg-neutral-700 p-2 m-auto mb-8 rounded-lg w-60 ${
                                    selectedAnswer === answer
                                        ? answer === correctAnswer
                                            ? "bg-green-500"
                                            : "bg-red-500"
                                        : ""
                                }`}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: `<p>${answer}</p>`,
                                    }}
                                ></div>
                            </button>
                        ))}
                    </div>
                </div>
            )
        } else {
            // setTimeout(() => {
            //     window.location.href = "/game"
            // }, 1500)
            return (
                <div>
                    <p>ASDASD.</p>
                </div>
            )
        }
    }

    return (
        <div className="h-screen text-center font-medium">
            <ToastContainer />
            {data ? (
                <div>
                    {data.questions > 0 ? (
                        <div>
                            <p className="mt-8">Category: {data.category}</p>
                            <div className="flex justify-around text-lg font-medium mt-8 mb-8">
                                <p>{data.name}</p>
                            </div>
                            {renderQuestion()}
                        </div>
                    ) : (
                        <div className="h-screen flex flex-col justify-evenly">
                            <div className="flex flex-col justify-center text-center">
                                <p className="mb-4">YOUR SCORE</p>
                                <p>{data.name}</p>
                                <p>{data.score}</p>
                            </div>
                            <a
                                href="/"
                                className="text-lg underline text-blue-500 self-center"
                            >
                                Click to play again!
                            </a>
                        </div>
                    )}
                </div>
            ) : (
                // ! IF USER ACCIDENTALLY WENT TO THE LINK REDIRECTS TO HOMEPAGE, DON'T CHANGE ! \\
                window.location.href = "/"
            )}
        </div>
    )
}

export default Page
