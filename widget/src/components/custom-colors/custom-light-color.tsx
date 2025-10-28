import { ColorPalette } from "@/types/theme";
import CustomColorComponent from "./custom-colors";

interface Props {
    colorsObject: ColorPalette;
    setColorsObject: (color: ColorPalette) => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 mt-4 mb-1">
            <div className="h-px flex-1 bg-gray-200" />
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
            <div className="h-px flex-1 bg-gray-200" />
        </div>
        {children}
    </div>
);

const CustomLightColor = ({ colorsObject, setColorsObject }: Props) => {
    return (
        <div className="space-y-4">
            {/* General */}
            <Section title="General">
                <CustomColorComponent
                    colorsObject={colorsObject}
                    setColorsObject={setColorsObject}
                    label="Modal Background"
                    nameObject="backgroundColor"
                />
                <CustomColorComponent
                    colorsObject={colorsObject}
                    setColorsObject={setColorsObject}
                    label="Muted Background"
                    nameObject="mutedBackground"
                />
                <CustomColorComponent colorsObject={colorsObject} setColorsObject={setColorsObject} label="Border" nameObject="borderColor" />
                {/* <CustomColorComponent
                    colorsObject={colorsObject}
                    setColorsObject={setColorsObject}
                    label="Accent"
                    nameObject="accentColor"
                /> */}
            </Section>

            {/* Text */}
            <Section title="Text">
                <CustomColorComponent colorsObject={colorsObject} setColorsObject={setColorsObject} label="Primary Text" nameObject="primaryText" />
                <CustomColorComponent
                    colorsObject={colorsObject}
                    setColorsObject={setColorsObject}
                    label="Secondary Text"
                    nameObject="secondaryText"
                />
            </Section>

            {/* Buttons */}
            <Section title="Buttons">
                <CustomColorComponent colorsObject={colorsObject} setColorsObject={setColorsObject} label="Button" nameObject="button" />
                <CustomColorComponent colorsObject={colorsObject} setColorsObject={setColorsObject} label="Swap Button" nameObject="swapButton" />
            </Section>
            {/* Icons */}
            <Section title="Icons">
                <CustomColorComponent colorsObject={colorsObject} setColorsObject={setColorsObject} label="Swap Icon" nameObject="swapIcon" />
                <CustomColorComponent colorsObject={colorsObject} setColorsObject={setColorsObject} label="Header Icons" nameObject="iconsHeader" />
            </Section>
        </div>
    );
};

export default CustomLightColor;
