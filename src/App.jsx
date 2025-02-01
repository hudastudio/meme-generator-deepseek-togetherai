import MemeGenerator from '@/components/MemeGenerator'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center">AI Meme Generator</h1>
        <p className="text-center text-sm text-slate-500 mb-8">
          DeepSeek AI Gratis dari <a href="https://api.together.ai/">https://api.together.ai/</a>
        </p>
        <MemeGenerator />
      </div>
    </div>
  )
}

export default App