// api/generate.js
// ... (bagian atas tetep sama ya bray, langsung ke baris fetch aja)

    const response = await fetch('https://api.freepik.com/v1/ai/video-generation', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': apiKey,                    // Cara 1 (Freepik standard)
        'Authorization': `Bearer ${apiKey}`    // Cara 2 (Magnific API Direct)
      },
      body: JSON.stringify({
        model: modelType,
        prompt: prompt,
        image: imageUrl
      })
    });
