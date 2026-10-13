type ButtonProps = {
  title: string;
  onClick?: () => void;
};

export default function Button({ title, onClick }: ButtonProps) {
  return (
    <>
      <button
        onClick={onClick}
        className="w-full h-13 bg-[#3B8519] rounded-[10px] flex justify-center items-center cursor-pointer"
      >
        <p className="text-white text-base font-bold">{title}</p>
      </button>
    </>
  );
}
