import React from "react";
import styles from "./index.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div>
        
      </div>
      <ul>
        <li>
          <Link href="/home">home</Link>
        </li>
        <li>
          <Link href="/projects">projects</Link>
        </li>
        <li>
          <Link href="/technologies">technologies</Link>
        </li>
        <li>
          <Link href="/experience">experience</Link>
        </li>
        <li>
          <Link href="/skills">skills</Link>
        </li>
        <li>
          <Link href="/education">education</Link>
        </li>
        <li>
          <Link href="/contact">contact</Link>
        </li>
        <li>
          <Link href="/articles">articles</Link>
        </li>
      </ul>
    </header>
  );
}
