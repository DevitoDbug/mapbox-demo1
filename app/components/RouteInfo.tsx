import React from "react";

type RouteInfoProps = {
	distance: number;
	costPerMeter: number;
};
const formatCost = (costValue: number) => {
	return new Intl.NumberFormat("en-KE", {
		style: "currency",
		currency: "KES",
	}).format(Number(costValue));
};

const RouteInfo = ({ distance, costPerMeter = 180 }: RouteInfoProps) => {
	const fuelCost = ((distance / 13000) * costPerMeter).toFixed(2);
	const driverCost = (Number(fuelCost) * 0.4).toFixed(2);
	const miscCost = (Number(fuelCost) * 2.5).toFixed(2);
	const total = (
		Number(fuelCost) +
		Number(driverCost) +
		Number(miscCost)
	).toFixed(2);

	return (
		<div>
			<h2>Route Information</h2>
			<div className="flex flex-col gap-2 ">
				<div className="flex-col gap-2">
					<p>Distance: {distance} meters</p>
					<p>Distance: {distance / 1000} kilometers</p>
				</div>
				<div className="flex-col gap-2">
					<p>Fuel cost: {formatCost(Number(fuelCost))}</p>
					<p>Driver cost: {formatCost(Number(driverCost))}</p>
					<p>Other costs: {formatCost(Number(miscCost))}</p>
					<p>Total cost:{formatCost(Number(total))}</p>
				</div>
			</div>
		</div>
	);
};

export default RouteInfo;
