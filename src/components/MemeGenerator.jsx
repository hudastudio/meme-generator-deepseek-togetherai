import { useState, useRef, useEffect } from 'react';
import { Upload, Loader2, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const MemeGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [memeText, setMemeText] = useState('');
    const [thinking, setThinking] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [streamingText, setStreamingText] = useState('');
    const streamingTextRef = useRef('');

    useEffect(() => {
        const { thinking, cleanText } = extractThinkingAndText(streamingText);
        setThinking(thinking);
        setMemeText(cleanText);
    }, [streamingText]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const extractThinkingAndText = (text) => {
        const thinkMatch = text.match(/<think>([\s\S]*?)<\/think>/);
        const thinking = thinkMatch ? thinkMatch[1].trim() : '';
        const cleanText = text.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        return { thinking, cleanText };
    };

    const handleSaveImage = async () => {
        if (!imagePreview || !memeText) return;

        // Create a temporary canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create a temporary image to get dimensions
        const img = new Image();
        img.src = imagePreview;
        
        await new Promise((resolve) => {
            img.onload = () => {
                // Set canvas dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image
                ctx.drawImage(img, 0, 0);

                // Add semi-transparent black gradient at the bottom
                const gradient = ctx.createLinearGradient(0, canvas.height - 150, 0, canvas.height);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, canvas.height - 150, canvas.width, 150);

                // Add text
                ctx.font = 'bold 48px Arial';
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                
                // Add text shadow
                ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Word wrap text
                const words = memeText.split(' ');
                const lines = [];
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    const width = ctx.measureText(currentLine + ' ' + words[i]).width;
                    if (width < canvas.width - 40) {
                        currentLine += ' ' + words[i];
                    } else {
                        lines.push(currentLine);
                        currentLine = words[i];
                    }
                }
                lines.push(currentLine);

                // Draw each line
                lines.forEach((line, index) => {
                    ctx.fillText(
                        line,
                        canvas.width / 2,
                        canvas.height - 20 - (lines.length - 1 - index) * 60
                    );
                });

                // Convert to blob and download
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'meme.png';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 'image/png');

                resolve();
            };
        });
    };

    const generateMemeText = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description for your meme');
            return;
        }

        setLoading(true);
        setError('');
        setMemeText('');
        setThinking('');
        setStreamingText('');
        streamingTextRef.current = '';

        try {
            const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
                    messages: [{
                        role: 'user',
                        content: `Buatkan caption meme lucu untuk konteks ini: ${prompt}. Buatlah singkat, cerdas, dan mudah diingat. Gunakan humor khas meme.`
                    }],
                    stream: true
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonString = line.slice(6);
                        if (jsonString === '[DONE]') continue;

                        try {
                            const jsonData = JSON.parse(jsonString);
                            const content = jsonData.choices[0]?.delta?.content || '';
                            streamingTextRef.current += content;
                            setStreamingText(streamingTextRef.current);
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                        }
                    }
                }
            }
        } catch (err) {
            setError('Failed to generate meme text. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
                <CardHeader>
                    <CardTitle>AI Meme Generator</CardTitle>
                    <CardDescription>
                        Unggah gambar dan biarkan AI membuat caption meme lucu untukmu
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="image-upload">Upload Gambar</Label>
                        <div className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg p-6 hover:bg-slate-50 transition-colors cursor-pointer">
                            <input
                                id="image-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center gap-2 cursor-pointer"
                            >
                                {!imagePreview ? (
                                    <>
                                        <Upload className="w-8 h-8 text-slate-400" />
                                        <span className="text-sm text-slate-600">Klik untuk upload gambar</span>
                                        <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
                                    </>
                                ) : (
                                    <div className="relative w-full aspect-video">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-contain rounded-md"
                                        />
                                        {thinking && (
                                            <div className="absolute inset-x-0 bottom-0 p-4 text-center bg-gradient-to-t from-black/50 to-transparent">
                                                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                                                    {memeText}
                                                </h2>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="prompt">Deskripsi Meme</Label>
                        <Textarea
                            id="prompt"
                            placeholder="Jelaskan konteks gambar untuk meme yang ingin dibuat..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>

                <CardFooter className="flex gap-4">
                    <Button
                        className="flex-1 bg-black hover:bg-black/90"
                        onClick={generateMemeText}
                        disabled={loading || !prompt || !imageFile}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Lagi dimasak...
                            </>
                        ) : (
                            'Buat Meme'
                        )}
                    </Button>
                    
                    {thinking && (
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={handleSaveImage}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Simpan Meme
                        </Button>
                    )}
                </CardFooter>
            </Card>

            {thinking && (
                <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
                    <CardHeader>
                        <CardTitle>AI Thinking Process</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="whitespace-pre-wrap font-mono text-sm bg-slate-50 p-4 rounded-lg">
                            {thinking}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default MemeGenerator;