export const mileageAllowanceYear = 2026;
export const mileageAllowanceSourceUrl =
  "https://www.skatteetaten.no/satser/bilgodtgjorelse-kilometergodtgjorelse/";

export const mileageVehicleRates = [
  {
    value: "car",
    label: "Bil (også elbil)",
    taxFreeRate: 3.5,
    defaultEmployerRate: 5.3,
  },
  {
    value: "motorboat",
    label: "Motorbåt",
    taxFreeRate: 7.5,
    defaultEmployerRate: 7.5,
  },
  {
    value: "snowmobile-atv",
    label: "Snøscooter og ATV",
    taxFreeRate: 10,
    defaultEmployerRate: 10,
  },
  {
    value: "heavy-motorcycle",
    label: "Tung motorsykkel (over 125 ccm)",
    taxFreeRate: 2.95,
    defaultEmployerRate: 2.95,
  },
  {
    value: "light-motorcycle",
    label: "Moped, lett motorsykkel og andre motoriserte fremkomstmidler",
    taxFreeRate: 2,
    defaultEmployerRate: 2,
  },
] as const;

export const mileageAdditionRates = {
  passenger: 1,
  forestRoad: 1,
  equipment: 1,
} as const;

export type MileageVehicleValue = (typeof mileageVehicleRates)[number]["value"];

export type MileageAllowanceInput = {
  distance: number;
  employerRate: number;
  vehicle: MileageVehicleValue;
  passengers: number;
  forestRoad: boolean;
  equipment: boolean;
};

export type MileageAllowanceCalculation = MileageAllowanceInput & {
  vehicleLabel: string;
  taxFreeRate: number;
  baseAmount: number;
  passengerAddition: number;
  forestRoadAddition: number;
  equipmentAddition: number;
  additionsTotal: number;
  totalPayout: number;
  taxFreeAmount: number;
  taxableAmount: number;
};

export function calculateMileageAllowance(
  input: MileageAllowanceInput,
): MileageAllowanceCalculation {
  const vehicle =
    mileageVehicleRates.find((option) => option.value === input.vehicle) ??
    mileageVehicleRates[0];
  const passengerAddition =
    input.distance * input.passengers * mileageAdditionRates.passenger;
  const forestRoadAddition = input.forestRoad
    ? input.distance * mileageAdditionRates.forestRoad
    : 0;
  const equipmentAddition = input.equipment
    ? input.distance * mileageAdditionRates.equipment
    : 0;
  const additionsTotal = passengerAddition + forestRoadAddition + equipmentAddition;
  const baseAmount = input.distance * input.employerRate;
  const taxFreeBaseAmount = input.distance * Math.min(input.employerRate, vehicle.taxFreeRate);
  const totalPayout = baseAmount + additionsTotal;
  const taxFreeAmount = taxFreeBaseAmount + additionsTotal;

  return {
    ...input,
    vehicleLabel: vehicle.label,
    taxFreeRate: vehicle.taxFreeRate,
    baseAmount,
    passengerAddition,
    forestRoadAddition,
    equipmentAddition,
    additionsTotal,
    totalPayout,
    taxFreeAmount,
    taxableAmount: Math.max(0, totalPayout - taxFreeAmount),
  };
}
