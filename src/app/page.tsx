///import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function Index() {
  return (
    <main className={styles.main}>
      <Header />
      <Link href='/curriculum'>Ir para currículo</Link>
      
      <Footer />
    </main>
  )
}
