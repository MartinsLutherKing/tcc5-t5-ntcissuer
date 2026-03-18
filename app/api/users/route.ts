export async function GET() {
    const envVar = process.env.NEXT_PUBLIC_CERTIFICATE_ADDRESS;
    console.log("Server-side env var:", envVar);
    return Response.json({ envVar });
}