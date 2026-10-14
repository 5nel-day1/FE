import logo from "../../assets/icons/sku_logo.png";

export default function Header() {
    return (
        <header className="w-full h-[69px] bg-white flex items-center justify-start pl-[8px] gap-2">
            <img src={logo} className="w-[35px] h-[35px]" />
            <div className="flex flex-col gap-[1px]">
                <p className="text-[#727070] text-[10px] font-medium">서경대학교</p>
                <p className="text-black text-sm font-semibold">CatchU</p>
            </div>
        </header>
    );
}