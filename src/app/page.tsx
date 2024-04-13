"use client"

// TODO: SHOW MOST RECENT SCORE AT THE TOP
// TODO: SHOW 10 HIGHSCORES AT THE BOTTOM

import React, { useState, useEffect } from "react"
import Link from "next/link"

interface Category {
    id: string
    name: string
}

const Home = () => {
    const [username, setUsername] = useState("Player")
    const [numberOfQuestions, setnumberOfQuestions] = useState<number>(10)
    const [timeLimit, setTimeLimit] = useState("0")
    const [category, setCategory] = useState("General Knowledge")
    const [categoryID, setCategoryID] = useState("9")

    const [allCategories, setAllCategories] = useState<Array<Category>>([])

    useEffect(() => {
        const getCategories = async () => {
            const response = await fetch(
                "https://opentdb.com/api_category.php",
                {
                    method: "GET",
                    mode: "cors",
                }
            )
            const data = await response.json()
            setAllCategories(data.trivia_categories)
        }
        getCategories()
    }, [])

    const onSubmit = () => {
        localStorage.clear()

        const currentGame = {
            name: username,
            questions: numberOfQuestions,
            limit: timeLimit,
            category: category,
            category_id: categoryID,
            score: 0,
        }

        localStorage.setItem("current", JSON.stringify(currentGame))

        const getQuestions = async () => {
            const response = await fetch(
                `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${categoryID}&type=multiple`,
                {
                    method: "GET",
                    mode: "cors",
                }
            )
            const data = await response.json()
            localStorage.setItem("questions", JSON.stringify(data))
        }
        getQuestions()
    }

    return (
        <div className="h-screen flex-wrap justify-center text-center font-medium">
            <div className="mb-8 mt-8">
                <h2>Previous score</h2>
                <p>Player: 31313</p>
            </div>
            <form className="flex w-full flex-col">
                <div className="relative mb-3">
                    <label className="block mb-2 text-sm">Name</label>
                    <input
                        type="text"
                        className="bg-neutral-700 p-2 rounded-lg text-sm"
                        placeholder="Player"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="relative mb-3">
                    <label className="block mb-2 text-sm">
                        Choose number of questions (1-50)
                    </label>
                    <input
                        type="number"
                        className="bg-neutral-700 p-2 rounded-lg text-sm"
                        placeholder="1-50"
                        min={1}
                        max={50}
                        value={numberOfQuestions}
                        onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (value > 50) {
                                setnumberOfQuestions(50)
                                return
                            }

                            if (value < 1 || isNaN(value)) {
                                setnumberOfQuestions(1)
                                return
                            }

                            setnumberOfQuestions(value)
                        }}
                        required
                    />
                </div>

                <div className="relative mb-3">
                    <label className="block mb-2 text-sm">
                        Select time limit per question
                    </label>
                    <select
                        className="bg-neutral-700 p-2 rounded-lg text-sm"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                        required
                    >
                        <option value="0">Unlimited</option>
                        <option value="15">15 seconds</option>
                        <option value="30">30 seconds</option>
                        <option value="60">60 seconds</option>
                        <option value="120">120 seconds</option>
                        <option value="360">360 seconds</option>
                    </select>
                </div>

                <div className="relative mb-3">
                    <label className="block mb-2 text-sm">
                        Select category
                    </label>
                    <select
                        className="bg-neutral-700 p-2 rounded-lg text-sm"
                        value={categoryID}
                        onChange={(e) => {
                            const selectedCategoryID = e.target.value
                            const selectedCategory = allCategories.find(
                                (category) => category.id == selectedCategoryID
                            )

                            setCategoryID(selectedCategoryID)
                            // @ts-ignore
                            setCategory(selectedCategory.name)
                        }}
                        required
                    >
                        {allCategories.map((category: any) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Link href="/game">
                    <button onClick={onSubmit} disabled={!username}>
                        Start
                    </button>
                </Link>
            </form>
        </div>
    )
}

export default Home
