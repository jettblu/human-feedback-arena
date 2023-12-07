import Image from "next/image";

export interface IInstructionProps {
  onBegin: () => void;
}
const Instruction = (props: IInstructionProps) => (
  <div className="flex flex-col px-4 py-2 border-2 border-yellow-500 max-w-xl">
    <h2 className="text-2xl font-bold text-left text-yellow-500">
      Instructions
    </h2>
    <ul className="list-disc list-inside text-md text-red-500">
      <li className="my-2">
        🐍 Use the arrow keys to move the snake. The snake should eat the food
        and avoid hitting the walls and itself. Try to replicate the slithering
        pattern of a real snake, when possible.
      </li>
      <li className="my-2">
        🔋 A green progress bar, will indicate how many more moves you must
        make. Once full, you are done! An agent will begin training on your
        playing style.
      </li>
    </ul>

    <button
      className="bg-green-500 hover:bg-green-600 transition duration-100 text-white font-bold py-2 px-4 rounded my-6 text-xl"
      onClick={props.onBegin}
    >
      Begin Game
    </button>
  </div>
);

export default Instruction;
