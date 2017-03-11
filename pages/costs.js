

export const HARDWARE_COST_MULTIPLIER = (cam_qty) => { 
	if(cam_qty <= 100) return 3; 
	if(cam_qty <= 500) return 2.75;  
	else return 2.5;
}

export const TAXES_SHIPPING_MULTIPLIER = 1.25;


export const CAMERA_MANTA_RAY_COST = 120;


export const CAMERA_STING_RAY_COST = 95;
export const CAMERA_STING_RAY_3G = 100;
export const CAMERA_STING_RAY_GPS = 15;
export const CAMERA_STING_RAY_MEMORY = 15;
export const CAMERA_STING_RAY_BATTERY = 15;

export const DOCKING_STATION_SIMPLE = 540; 
export const DOCKING_STATION_ADVANCED = 1600;

export const PER_GIGABIT_COST = 0.006;
export const STORAGE_MULTIPLIER = 3;
export const GIGABIT_PER_HOUR = 1.125;  //Based on quality this is the most improvement we can make, 720p drops to 

export const YEARLY_SERVICE_COST = (cam_qty) => {
	return Math.ceil(cam_qty / 100) * 20000;
}
