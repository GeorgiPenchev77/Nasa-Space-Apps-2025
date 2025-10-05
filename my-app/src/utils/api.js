export async function sendHighlightToBackend(text) {
  try {
    const response = await fetch("http://localhost:3000/api/highlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("Failed to send highlight");

    const data = await response.json();
    console.log("AI Response:", data.result);
    return data.result;
  } catch (err) {
    console.error("sendHighlightToBackend error:", err);
  }
}
