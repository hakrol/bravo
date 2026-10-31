import { SalaryGenderExplorer, type SalaryGenderExplorerProps } from "@/components/salary-gender-explorer";

// Artikkelwrappers sender inn sammenlignbare medianverdier fra et frosset snapshot.
export function BlogGenderSalaryExplorer(props: SalaryGenderExplorerProps) {
  return <SalaryGenderExplorer {...props} />;
}
