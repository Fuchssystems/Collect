

model.Pickup.Tyres_Pieces_without_RIM.onGet = function() {
	return this.Tyres_Pieces_Total - this.Tyres_Pieces_with_RIM;
};


model.Pickup.Tyres_Pieces_Best_Singles.onGet = function() {
	return this.Tyres_Pieces_Best_Total + this.Tyres_Pieces_Best_in_Pairs;
};
