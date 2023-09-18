import React, { useState } from "react"

const page = async () => {
    // const [username, setUsername] = useState('')
    // const [category, setCategory] = useState('')

    const response = await fetch("https://opentdb.com/api_category.php")
    const allCategories = await response.json()

    return (
        <div>
            <form className="flex justify-center flex-col">
                <div className="relative mb-3">
                    <label className="block mb-2 text-sm font-medium ">
                        Username
                    </label>
                    <input
                        type="text"
                        className="bg-neutral-700 p-2 rounded-lg text-sm font-medium"
                        placeholder="Player"
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
                        placeholder="10"
                        min={1}
                        max={50}
                        required
                    />
                </div>

                <div className="relative mb-3">
                    <label className="block mb-2 text-sm font-medium">
                        Time limit per question
                    </label>
                    <select
                        className="bg-neutral-700 p-2 rounded-lg text-sm font-medium"
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
                        required
                    >
                        {allCategories.trivia_categories.map(
                            (category: any) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </form>
        </div>
    )
}

export default page
