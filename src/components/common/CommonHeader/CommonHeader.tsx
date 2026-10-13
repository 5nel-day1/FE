import { useNavigate } from "react-router-dom";

type CommonHeaderProps = {
  title: string;
  img: string;
};

export default function CommonHeader({ title, img }: CommonHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[68px] relative flex justify-center items-center bg-white">
      <img
        src={img}
        onClick={() => navigate(-1)}
        className="absolute left-[21px] top-[26px] w-5 h-5 cursor-pointer"
      />
      <div className="text-black text-xl font-bold">{title}</div>
    </div>
  );
}
