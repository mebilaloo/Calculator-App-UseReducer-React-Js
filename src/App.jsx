import "./styels.css"; 

import { useReducer } from "react";
import DigitButton from "./DigitButton"; 
import OperationButton from "./OperationButton"; 

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete_digit",
  EVALUATE: "evaluate",
};

// Reducer function to manage state updates
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      // Adding a digit to the current operand
      if(state.overWrite) { // If the state is set to overwrite, reset the current operand
        return{
          ...state,
          currentOperand: payload.digit,
          overWrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state; // If the current operand is 0 and the new digit is also 0, do nothing
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state; // If the current operand already contains a decimal point and new digit is '.', do nothing
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`, // Concatenate the new digit to the current operand
      };

    case ACTIONS.CHOOSE_OPERATION:
      // Choosing an operation
      if (state.currentOperand == null && state.previousOperand == null) {
        return state; // If there's no current or previous operand, do nothing
      }
      if (state.currentOperand == null) {
        // If there's no current operand, update the operation
        return {
          ...state,
          operation: payload.operation,
          currentOperand: null,
        };
      }
      if (state.previousOperand == null) {
        // If there's no previous operand, update the operation and set the previous operand
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      // If both operands are present, evaluate the previous operation and update the state
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      // Clearing the calculator state
      return {};
      
    case ACTIONS.DELETE_DIGIT:
      // Deleting the last digit from the current operand
      if(state.overWrite){
        return{
          ...state,
          overWrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null ) return state; // If there's no current operand, do nothing
      if(state.currentOperand.length === 1){
        return {...state, currentOperand:null}; // If there's only one digit, reset the current operand
      }
      // Remove the last digit from the current operand
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      };

    case ACTIONS.EVALUATE:
      // Evaluating the expression
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state; // If any operand or operation is missing, do nothing
      }
      // Evaluate the expression and update the state
      return {
        ...state,
        previousOperand: null,
        overWrite:true,
        operation: null,
        currentOperand: evaluate(state),
      };

    default:
      return state;
  }
}

// Function to evaluate the expression based on the operation
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) return ""; // If either operand is not a number, return an empty string

  let computation = "";
  switch (operation) { // Perform the appropriate operation
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString(); // Convert the result to string and return
}

// Formatter function to format the operand for display
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0 });
function formatOperand(operand) {
  if (operand == null) return; // If the operand is null, return nothing
  const [integer, decimal] = operand.split("."); // Split the operand into integer and decimal parts
  if (decimal == null) return INTEGER_FORMATTER.format(integer); // If there's no decimal part, format the integer part only
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`; // Format both integer and decimal parts
}

function App() {
  // Define state using useReducer hook
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)} {operation}
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
 
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />

        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch}/>

        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      </div>
    </>
  );
}

export default App;
