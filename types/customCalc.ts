
export type InputSourceType = 'USER_INPUT' | 'LINKED_TO_A_INPUT' | 'RESULT_FROM_A';

export interface InputMapping {
  targetInputId: string; // Input ID in Calculator B
  sourceType: InputSourceType;
  sourceId?: string; // Input ID in Calculator A (if LINKED_TO_A_INPUT)
}

export interface CustomCalculator {
  id: string;
  name: string;
  description: string;
  calculatorAId: string;
  calculatorBId: string;
  inputMappings: InputMapping[];
  createdAt: number;
  customUnit?: string; // Easter egg: Override result unit label
}
