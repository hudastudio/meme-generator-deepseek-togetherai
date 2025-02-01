# AI Meme Generator

A React-based meme generator that leverages the free DeepSeek-R1-Distill-Llama-70B model through Together AI's platform to create witty meme captions in Bahasa Indonesia. The application showcases how to integrate powerful AI language models into web applications without cost barriers. Built with React, Vite, Tailwind CSS, and shadcn/ui components.

## Features

- 🖼️ Image upload support (PNG, JPG up to 5MB)
- 🤖 AI-powered meme caption generation
- 💭 Real-time streaming of AI responses
- 💾 Save generated memes as images
- 🎨 Beautiful UI with Tailwind CSS
- 🔍 Preview generated memes before saving
- 🤔 Visible AI thinking process
- 🇮🇩 Bahasa Indonesia support

## Why DeepSeek on Together AI?

This project uses the DeepSeek-R1-Distill-Llama-70B model available for free through Together AI's platform. This model offers:

- High-quality text generation capabilities
- Fast response times
- No usage costs
- Easy API integration
- Streaming response support
- Limitation : 6 request / minute

## Prerequisites

- Node.js 18.x or higher
- Together AI API key
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hudastudio/meme-generator-deepseek-togetherai
cd meme_generator_togetherai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Together AI API key:
```env
VITE_TOGETHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`

## Project Structure

```
meme_generator_togetherai/
├── src/
│   ├── components/
│   │   └── ui/          # shadcn/ui components
│   ├── App.jsx          # Main application component
│   ├── MemeGenerator.jsx # Meme generator component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── .env                 # Environment variables
└── package.json         # Project dependencies
```

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **API Integration**: Together AI
- **Language Model**: DeepSeek-R1-Distill-Llama-70B

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_TOGETHER_API_KEY | Together AI API Key | Yes |

## Features in Detail

### Image Upload
- Supports PNG and JPG formats
- Maximum file size: 5MB
- Real-time image preview
- Drag and drop support

### AI Caption Generation
- Uses Together AI's DeepSeek model
- Streaming response for real-time updates
- Includes thinking process visualization
- Generates witty captions in Bahasa Indonesia

### Meme Export
- Save as PNG with caption overlay
- Automatic text wrapping
- Text shadow for better visibility
- Gradient background behind text

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Together AI](https://together.ai) for the language model API
- [shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Vite](https://vitejs.dev) for the blazing fast build tool
- [Lucide](https://lucide.dev) for the beautiful icons