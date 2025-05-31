
interface SquareProps {
  value: string;
  onSquareClick?: () => void;
  highlight?: boolean;
}

export default function Square({ value, onSquareClick, highlight }: SquareProps) {
  return (
    <button
      className={`border w-40 h-12 p-1 font-bold text-3xl border-gray-300 min-h-20 rounded-md flex items-center justify-center
        ${highlight ? "bg-green-300" : "bg-red-300"}`}
      onClick={onSquareClick}
      type="button"
    >
      {value}
    </button>
  );
}
