"use client"

import React, { useState, useEffect } from "react"

interface Category {
    id: string
    name: string
}

const Page = () => {
    const [username, setUsername] = useState("")
    const [numerOfQuestions, setNumerOfQuestions] = useState("")
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
        // save username, number of questions, time limit, category to localstorage
        console.log(username, numerOfQuestions, timeLimit, category, categoryID)

        const mostRecentGame = {
            name: username,
            questions: numerOfQuestions,
            limit: timeLimit,
            category: category,
            category_id: categoryID,
        }
        localStorage.setItem("recent", JSON.stringify(mostRecentGame))
    }

    return (
        <div className="h-screen">
            <form className="flex justify-center flex-col">
                <div className="relative mb-3">
                    <label className="block mb-2 text-sm font-medium ">
                        Name
                    </label>
                    <input
                        type="text"
                        className="bg-neutral-700 p-2 rounded-lg text-sm font-medium"
                        placeholder="Player"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="relative mb-3">
                    <label className="block mb-2 text-sm font-medium">
                        Choose number of questions
                    </label>
                    <input
                        type="number"
                        className="bg-neutral-700 p-2 rounded-lg text-sm font-medium"
                        placeholder="1-50"
                        min={1}
                        max={50}
                        value={numerOfQuestions}
                        onChange={(e) => {
                            // @ts-ignore
                            if (e.target.value > 50 || e.target.value < 1) {
                                return
                            }
                            setNumerOfQuestions(e.target.value)
                        }}
                        required
                    />
                </div>

                <div className="relative mb-3">
                    <label className="block mb-2 text-sm font-medium">
                        Select time limit per question
                    </label>
                    <select
                        className="bg-neutral-700 p-2 rounded-lg text-sm font-medium"
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
                    <label className="block mb-2 text-sm font-medium">
                        Select category
                    </label>
                    <select
                        className="bg-neutral-700 p-2 rounded-lg text-sm font-medium"
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
                <button onClick={onSubmit}>Start</button>
            </form>
        </div>
    )
}

export default Page
