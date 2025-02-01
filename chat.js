import Together from 'together-ai';
const together = new Together({
  apiKey: 'fc15e6964a1d3fcccad6faad60989e462978dbd980003027e6b8e05f17d14c4b'  // Better to use environment variable
});

async function main() {
  try {
    const stream = await together.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
      messages: [
        { role: 'user', content: 'What are the top 3 things to do in New York?' },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();