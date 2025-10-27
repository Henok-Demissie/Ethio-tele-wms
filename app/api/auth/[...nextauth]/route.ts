import { handlers } from "@/auth"

export async function GET(request: Request) {
	if (handlers && typeof handlers.GET === "function") {
		return handlers.GET(request as any)
	}
	return new Response("NextAuth GET handler is not configured.", { status: 500 })
}

export async function POST(request: Request) {
	if (handlers && typeof handlers.POST === "function") {
		return handlers.POST(request as any)
	}
	return new Response("NextAuth POST handler is not configured.", { status: 500 })
}
