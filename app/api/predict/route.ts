// app/api/predict/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const r = await fetch(
			"https://api-76c3cf10-448643b6-dku.eu-west-3.app.dataiku.io/public/api/v1/deploy/predict/predict",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.DATAIKU_API_KEY}`, // Mets ta clé API dans un .env.local
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			}
		);

		const data = await r.json();
		return NextResponse.json(data, { status: r.status });
	} catch (err: any) {
		return NextResponse.json(
			{ error: "Erreur côté proxy", details: err.message },
			{ status: 500 }
		);
	}
}
