import React from "react"

export default function Footer() {
    return (
        <footer className="bg-neutral-700">
            <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center -mx-5 -my-2">
                    <div className="px-5 py-2">
                        <a
                            href="https://opentdb.com/"
                            target="_blank"
                            className="text-base leading-6 text-white hover:text-neutral-900"
                        >
                            Contribute
                        </a>
                    </div>
                </div>
                {/* <p className="mt-8 text-base leading-6 text-center">
                    <a
                        className="text-neutral-500 hover:text-neutral-900"
                        href="https://airidassimanskis.vercel.app/"
                        target="_blank"
                    >
                        © 2023 Airidas Šimanskis
                    </a>
                </p> */}
            </div>
        </footer>
    )
}
