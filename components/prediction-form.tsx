"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, Home, TrendingUp } from "lucide-react";

interface PredictionResult {
	result: {
		prediction: number;
		ignored: boolean;
	};
	timing: {
		preProcessing: number;
		wait: number;
		enrich: number;
		preparation: number;
		prediction: number;
		postProcessing: number;
	};
	apiContext: {
		serviceId: string;
		endpointId: string;
		serviceGeneration: string;
	};
}

export default function PredictionForm() {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<PredictionResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		area: "1800",
		basement: "true",
		parking: "2",
		stories: "2",
		number_rooms: "6",
		furnishingstatus: "semi-furnished",
		hotwaterheating: "false",
		bathrooms: "2",
		guestroom: "true",
		bedrooms: "3",
		mainroad: "true",
		airconditioning: "true",
		prefarea: "false",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const features = {
				area: Number.parseInt(formData.area),
				basement: formData.basement === "true" ? "yes" : "no",
				parking: Number.parseInt(formData.parking),
				stories: Number.parseInt(formData.stories),
				number_rooms: Number.parseInt(formData.number_rooms),
				furnishingstatus: formData.furnishingstatus,
				hotwaterheating: formData.hotwaterheating === "true" ? "yes" : "no",
				bathrooms: Number.parseInt(formData.bathrooms),
				guestroom: formData.guestroom === "true" ? "yes" : "no",
				bedrooms: Number.parseInt(formData.bedrooms),
				mainroad: formData.mainroad === "true" ? "yes" : "no",
				airconditioning: formData.airconditioning === "true" ? "yes" : "no",
				prefarea: formData.prefarea === "true" ? "yes" : "no",
			};
			console.log("POST /api/predict:", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					features,
				}),
			});
			const response = await fetch("/api/predict", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					features,
				}),
			});

			if (!response.ok) {
				throw new Error("Prediction failed");
			}

			const data = await response.json();
			setResult(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="max-w-6xl mx-auto">
			<div className="grid md:grid-cols-2 gap-8">
				{/* Form Card */}
				<Card className="border-border bg-card">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Home className="h-5 w-5" />
							Property Details
						</CardTitle>
						<CardDescription>
							Enter the characteristics of the property
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Numeric Inputs */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="area">Area (sq ft)</Label>
									<Input
										id="area"
										type="number"
										value={formData.area}
										onChange={(e) => updateField("area", e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="bedrooms">Bedrooms</Label>
									<Input
										id="bedrooms"
										type="number"
										value={formData.bedrooms}
										onChange={(e) => updateField("bedrooms", e.target.value)}
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="bathrooms">Bathrooms</Label>
									<Input
										id="bathrooms"
										type="number"
										value={formData.bathrooms}
										onChange={(e) => updateField("bathrooms", e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="number_rooms">Total Rooms</Label>
									<Input
										id="number_rooms"
										type="number"
										value={formData.number_rooms}
										onChange={(e) =>
											updateField("number_rooms", e.target.value)
										}
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="stories">Stories</Label>
									<Input
										id="stories"
										type="number"
										value={formData.stories}
										onChange={(e) => updateField("stories", e.target.value)}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="parking">Parking Spaces</Label>
									<Input
										id="parking"
										type="number"
										value={formData.parking}
										onChange={(e) => updateField("parking", e.target.value)}
										required
									/>
								</div>
							</div>

							{/* Select Input */}
							<div className="space-y-2">
								<Label htmlFor="furnishingstatus">Furnishing Status</Label>
								<Select
									value={formData.furnishingstatus}
									onValueChange={(value) =>
										updateField("furnishingstatus", value)
									}
								>
									<SelectTrigger id="furnishingstatus">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="furnished">Furnished</SelectItem>
										<SelectItem value="semi-furnished">
											Semi-Furnished
										</SelectItem>
										<SelectItem value="unfurnished">Unfurnished</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Boolean Inputs */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="mainroad">Main Road</Label>
									<Select
										value={formData.mainroad}
										onValueChange={(value) => updateField("mainroad", value)}
									>
										<SelectTrigger id="mainroad">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="true">Yes</SelectItem>
											<SelectItem value="false">No</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="guestroom">Guest Room</Label>
									<Select
										value={formData.guestroom}
										onValueChange={(value) => updateField("guestroom", value)}
									>
										<SelectTrigger id="guestroom">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="true">Yes</SelectItem>
											<SelectItem value="false">No</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="basement">Basement</Label>
									<Select
										value={formData.basement}
										onValueChange={(value) => updateField("basement", value)}
									>
										<SelectTrigger id="basement">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="true">Yes</SelectItem>
											<SelectItem value="false">No</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="hotwaterheating">Hot Water Heating</Label>
									<Select
										value={formData.hotwaterheating}
										onValueChange={(value) =>
											updateField("hotwaterheating", value)
										}
									>
										<SelectTrigger id="hotwaterheating">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="true">Yes</SelectItem>
											<SelectItem value="false">No</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="airconditioning">Air Conditioning</Label>
									<Select
										value={formData.airconditioning}
										onValueChange={(value) =>
											updateField("airconditioning", value)
										}
									>
										<SelectTrigger id="airconditioning">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="true">Yes</SelectItem>
											<SelectItem value="false">No</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="prefarea">Preferred Area</Label>
									<Select
										value={formData.prefarea}
										onValueChange={(value) => updateField("prefarea", value)}
									>
										<SelectTrigger id="prefarea">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="true">Yes</SelectItem>
											<SelectItem value="false">No</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Predicting...
									</>
								) : (
									"Get Price Prediction"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				{/* Results Card */}
				<div className="space-y-6">
					{result && (
						<Card className="border-border bg-card">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="h-5 w-5" />
									Prediction Result
								</CardTitle>
								<CardDescription>Estimated property value</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="text-center py-8">
									<div className="text-5xl font-bold mb-2">
										$
										{result.result.prediction.toLocaleString("en-US", {
											maximumFractionDigits: 0,
										})}
									</div>
									<div className="text-sm text-muted-foreground">
										Predicted Price
									</div>
								</div>

								<div className="border-t border-border pt-6">
									<h4 className="text-sm font-medium mb-4">
										Performance Metrics
									</h4>
									<div className="grid grid-cols-2 gap-4">
										<div className="bg-secondary rounded-lg p-4">
											<div className="text-2xl font-bold">
												{result.timing.prediction}ms
											</div>
											<div className="text-xs text-muted-foreground">
												Prediction Time
											</div>
										</div>
										<div className="bg-secondary rounded-lg p-4">
											<div className="text-2xl font-bold">
												{result.timing.preProcessing}ms
											</div>
											<div className="text-xs text-muted-foreground">
												Pre-processing
											</div>
										</div>
										<div className="bg-secondary rounded-lg p-4">
											<div className="text-2xl font-bold">
												{result.timing.preparation}ms
											</div>
											<div className="text-xs text-muted-foreground">
												Preparation
											</div>
										</div>
										<div className="bg-secondary rounded-lg p-4">
											<div className="text-2xl font-bold">
												{result.timing.postProcessing}ms
											</div>
											<div className="text-xs text-muted-foreground">
												Post-processing
											</div>
										</div>
									</div>
								</div>

								<div className="border-t border-border pt-6">
									<h4 className="text-sm font-medium mb-3">API Context</h4>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Service ID:</span>
											<span className="font-mono">
												{result.apiContext.serviceId}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Endpoint:</span>
											<span className="font-mono">
												{result.apiContext.endpointId}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Generation:</span>
											<span className="font-mono">
												{result.apiContext.serviceGeneration}
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					{error && (
						<Card className="border-red-900/50 bg-red-950/20">
							<CardHeader>
								<CardTitle className="text-red-400">Error</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-red-300">{error}</p>
							</CardContent>
						</Card>
					)}

					{!result && !error && (
						<Card className="border-border bg-card/50">
							<CardContent className="py-12 text-center">
								<div className="text-muted-foreground">
									<Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
									<p className="text-sm">
										Fill out the form and submit to see the prediction results
									</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
