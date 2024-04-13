"use client"

import React, { useState, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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

function useLocalStorage(key: string, initialValue: any) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            console.error(error)
            return initialValue
        }
    })

    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key)
            if (item !== JSON.stringify(storedValue)) {
                setStoredValue(item ? JSON.parse(item) : initialValue)
            }
        } catch (error) {
            console.error(error)
        }
    }, [key, initialValue, storedValue])

    const setValue = (value: any) => {
        try {
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (error) {
            console.error(error)
        }
    }

    return [storedValue, setValue]
}

const Page = () => {
    const [data, setData] = useLocalStorage("current", {})
    const [triviaQuestions, setTQ] = useLocalStorage("questions", {})
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
    const [allAnswers, setAllAnswers] = useState<string[]>([])

    useEffect(() => {
        window.onbeforeunload = () => true
        return () => {
            window.onbeforeunload = null
        }
    }, [])

    useEffect(() => {
        if (
            triviaQuestions &&
            triviaQuestions.results &&
            triviaQuestions.results.length > 0
        ) {
            const currentQuestion = triviaQuestions.results[0]
            const correctAnswer = currentQuestion.correct_answer
            let answers = [...currentQuestion.incorrect_answers, correctAnswer]
            setAllAnswers(shuffleArray(answers))
        }
    }, [triviaQuestions, currentQuestionIndex])

    const handleAnswerClick = async (answer: string) => {
        if (!data) return

        const convertHtmlToText = (html: any) => {
            const tempElement = document.createElement("div")
            tempElement.innerHTML = html
            return tempElement.textContent || tempElement.innerText || ""
        }

        // fix answers that are HTML text to be plain text
        const correct_answer = convertHtmlToText(
            triviaQuestions.results[0].correct_answer
        )
        answer = convertHtmlToText(answer)

        const isCorrect = answer === correct_answer
        const scoreChange = isCorrect ? 1000 : -250
        const updatedData = {
            ...data,
            score: data.score + scoreChange,
            questions: data.questions - 1,
        }
        setData(updatedData)

        const buttons = document.querySelectorAll("#answers > button")
        buttons.forEach((button: any) => {
            button.className =
                "text-center bg-red-500 p-2 m-auto mb-8 rounded-lg w-60"
            button.disabled = true

            if (button.innerText === correct_answer) {
                button.className =
                    "text-center bg-green-500 p-2 m-auto mb-8 rounded-lg w-60"
                button.disabled = true
            }
        })

        toast(isCorrect ? "+1000" : "-250", {
            position: "bottom-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
        })

        // Do not shuffle again, just wait and move to the next question
        setTimeout(() => {
            let updatedQuestions = { ...triviaQuestions }
            updatedQuestions.results.splice(0, 1)
            setTQ(updatedQuestions)
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            const buttons = document.querySelectorAll("#answers > button")
            buttons.forEach((button: any) => {
                button.className =
                    "text-center bg-neutral-700 p-2 m-auto mb-8 rounded-lg w-60"
                button.disabled = false
            })
        }, 3000)
    }
    const renderQuestion = () => {
        if (
            data &&
            triviaQuestions.results &&
            triviaQuestions.results.length > 0
        ) {
            const currentQuestion = triviaQuestions.results[0]

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
                                className={
                                    "text-center bg-neutral-700 p-2 m-auto mb-8 rounded-lg w-60"
                                }
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: `<p>${answer}</p>`,
                                    }}
                                ></div>
                            </button>
                        ))}
                    </div>
                    <button
                        className="text-center bg-red-800 p-2 m-auto mb-8 rounded-lg w-60 mt-20"
                        onClick={() => {
                            localStorage.clear()
                            window.location.href = "/"
                        }}
                    >
                        Quit
                    </button>
                </div>
            )
        } else {
            // setTimeout(() => {
            //     window.location.href = "/game"
            // }, 3000)
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
            <p className="text-center text-red-500 mt-4">
                ONLY REFRESH THE PAGE WHEN QUESTIONS AND ANSWERS DO NOT APPEAR! W.I.P
            </p>
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
                (window.location.href = "/")
            )}
        </div>
    )
}

export default Page
