// REMOVED — Trust Score API deprecated in Stage 1 (chatbox-only).
// Returns 410 Gone so any leftover client calls fail loudly instead of silently.
export async function POST() {
  return new Response(
    JSON.stringify({ error: 'Trust scoring has been removed. Use the chatbox.' }),
    { status: 410, headers: { 'Content-Type': 'application/json' } }
  );
}
