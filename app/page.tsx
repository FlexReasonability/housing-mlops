import PredictionForm from "@/components/prediction-form";

export default function Home() {
	return (
		<main className="min-h-screen grid-background">
			<div className="container mx-auto px-4 py-12 md:py-20">
				{/* Header */}
				<div className="text-center mb-12 md:mb-16">
					<div className="inline-block mb-4 px-4 py-1.5 bg-secondary rounded-full">
						<span className="text-sm text-muted-foreground font-medium">
							Machine Learning Operations
						</span>
					</div>
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
						Housing-MLOPS
					</h1>
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
						Predict housing prices with advanced machine learning. Enter
						property details to get instant price estimates.
					</p>
				</div>

				{/* Prediction Form */}
				<PredictionForm />
			</div>
		</main>
	);
}
