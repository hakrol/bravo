const occupationGroupGradients: Record<string, string> = {
  "0": "linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)",
  "1": "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
  "2": "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)",
  "3": "linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)",
  "4": "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
  "5": "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
  "6": "linear-gradient(135deg, #ECFCCB 0%, #D9F99D 100%)",
  "7": "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
  "8": "linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)",
  "9": "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)",
};

export function getOccupationGroupGradient(occupationCode: string) {
  return (
    occupationGroupGradients[occupationCode.charAt(0)] ??
    "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)"
  );
}
