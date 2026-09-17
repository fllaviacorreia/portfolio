import React from 'react'
import styles from './index.module.css'
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Article() {
    return (
        <div id='articles'>
            <Header />
            <main>
                <p>Articles</p>
            </main>
            <Footer />
        </div>
    )
}