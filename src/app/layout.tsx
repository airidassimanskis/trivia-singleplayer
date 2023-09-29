import Footer from "./footer"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Triviaq",
    description: "Trivia game",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Footer/>
            </body>
        </html>
    )
}
