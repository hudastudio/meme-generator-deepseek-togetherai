import MemeGenerator from '@/components/MemeGenerator'
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-center">AI Meme Generator</h1>
        <p className="text-center text-sm text-slate-500 mb-8">
          DeepSeek AI Gratis dari <a href="https://api.together.ai/">https://api.together.ai/</a>
        </p>
        <MemeGenerator />
        <div className="text-center mt-10">
          <a
              className="text-center text-sm text-slate-500 hover:text-slate-700"
              style={{ cursor: 'pointer' }}
              onClick={() => window.open('https://github.com/hudastudio/meme-generator-deepseek-togetherai/', '_blank')}
          >
              <Github size={16} className="inline-block mr-2" />
              Github @ hudastudio
          </a>
        </div>
      </div>
    </div>
  )
}

export default App