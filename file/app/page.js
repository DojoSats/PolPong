import React from 'react';
import PongGame from '../components/PongGame';
import { Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Modern Pong Wars
          </h1>
          <p className="text-xl text-gray-300">A classic game reimagined</p>
        </header>

        <PongGame />

        <footer className="mt-12 text-center">
          <p className="text-sm text-gray-400 mb-2">
            Created by Your Name | Inspired by Koen van Gilst
          </p>
          <a
            href="https://github.com/taubuddha"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Github size={20} className="mr-1" />
            View source on GitHub
          </a>
        </footer>
      </main>
    </div>
  );
}