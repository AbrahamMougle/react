
interface SquareProps {
  value: string;
  onSquareClick?: () => void;
}

export default function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button
      className="border w-40 h-12 p-1 font-bold text-3xl border-gray-300 min-h-20 rounded-md flex items-center justify-center"
      onClick={onSquareClick}
      type="button"
    >
      {value}
    </button>
  );
}