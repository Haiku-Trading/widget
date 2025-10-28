import { ColorPalette } from "@/types/theme";
import { useEffect, useState } from "react";

interface Props {
    label: string;
    nameObject: keyof ColorPalette;
    colorsObject: ColorPalette;
    setColorsObject: (color: ColorPalette) => void;
}

const CustomColorComponent = ({ colorsObject, setColorsObject, nameObject, label }: Props) => {
    const [localColor, setLocalColor] = useState(colorsObject[nameObject] || "");

    // Update local state when the prop changes (e.g., when reset button is clicked)
    useEffect(() => {
        setLocalColor(colorsObject[nameObject] || "");
    }, [colorsObject[nameObject]]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localColor !== colorsObject[nameObject]) {
                setColorsObject({ ...colorsObject, [nameObject]: localColor });
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [localColor]);

    return (
        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <div className="flex gap-2">
                <input
                    type="color"
                    value={localColor}
                    onChange={(e) => setLocalColor(e.target.value)}
                    className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                    type="text"
                    value={localColor}
                    onChange={(e) => setLocalColor(e.target.value)}
                    className="flex-1 p-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#FFFFFF"
                />
            </div>
        </div>
    );
};

export default CustomColorComponent;
