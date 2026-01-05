import React from "react";

interface LaminarV3IconProps extends React.SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  size?: string | number; // Convenience prop for square icons
}

export const LaminarV3Icon: React.FC<LaminarV3IconProps> = ({
  width,
  height,
  size,
  ...props
}) => {
  // Convert size to pixels if it's a number
  const svgWidth = size ?? width;
  const svgHeight = size ?? height;

  // Ensure numeric values are converted to pixel strings
  const widthValue = typeof svgWidth === "number" ? `${svgWidth}px` : svgWidth;
  const heightValue =
    typeof svgHeight === "number" ? `${svgHeight}px` : svgHeight;

  // Use inline styles for explicit sizes to ensure they override host page CSS
  const inlineStyle =
    widthValue && heightValue
      ? {
          width: widthValue,
          height: heightValue,
        }
      : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      zoomAndPan="magnify"
      viewBox="0 0 36 36.000001"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      {...(widthValue && { width: widthValue })}
      {...(heightValue && { height: heightValue })}
      style={inlineStyle ? { ...props.style, ...inlineStyle } : props.style}
      {...props}
    >
      <defs>
        <clipPath id="82aaa0e5ef">
          <path
            d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="d104fe9803">
          <path
            d="M 18 0 C 8.328125 0 0.488281 7.839844 0.488281 17.511719 C 0.488281 27.1875 8.328125 35.027344 18 35.027344 C 27.671875 35.027344 35.511719 27.1875 35.511719 17.511719 C 35.511719 7.839844 27.671875 0 18 0 Z M 18 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="e12edb7a1f">
          <path
            d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="1bd64d514d">
          <path
            d="M 18 0 C 8.328125 0 0.488281 7.839844 0.488281 17.511719 C 0.488281 27.1875 8.328125 35.027344 18 35.027344 C 27.671875 35.027344 35.511719 27.1875 35.511719 17.511719 C 35.511719 7.839844 27.671875 0 18 0 Z M 18 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="c8455159af">
          <rect x="0" width="36" y="0" height="36" />
        </clipPath>
        <clipPath id="c6a0f7fbbe">
          <path
            d="M 3.988281 10.097656 L 31.71875 10.097656 L 31.71875 24.691406 L 3.988281 24.691406 Z M 3.988281 10.097656 "
            clipRule="nonzero"
          />
        </clipPath>
      </defs>
      <g clipPath="url(#82aaa0e5ef)">
        <g clipPath="url(#d104fe9803)">
          <g transform="matrix(1, 0, 0, 1, 0.000000000000000056, 0.000000000000010582)">
            <g clipPath="url(#c8455159af)">
              <g clipPath="url(#e12edb7a1f)">
                <g clipPath="url(#1bd64d514d)">
                  <path
                    fill="#000000"
                    d="M 0.488281 0 L 35.511719 0 L 35.511719 35.027344 L 0.488281 35.027344 Z M 0.488281 0 "
                    fillOpacity="1"
                    fillRule="nonzero"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#c6a0f7fbbe)">
        <g transform="matrix(0.149595, 0, 0, 0.149595, 3.165024, 2.089851)">
          <image
            x="0"
            y="0"
            width="200"
            xlinkHref="data:image/jpeg;base64,/9j/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wAARCADIAMgDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+f+gAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAAAnoKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoA0PC3hbX/GviCy8KeFdGu9S1PUbuO107TrC2aae6nkYKkUaKCzuzEAKBkk0Af0bf8EUf+DbH4dfBj4R3/wAV/wBuzwbYa9458ZaDdaedCuYYrm28MWdzC0UsUQcPHJfFWO+4wywn93Fk75CAflB/wWg/4Iv/ABe/4JdfGB5raK51v4aa1cu3hXxTHCSqrn/j3n/55yoMAgn0OSCGIB8MUAFABQAUAFABQAUAFABg+lAEkFpdXJItrd5CBkiNC2PyoAYUZThhg5xg9aAEII4IoAKACgAoAKACgAoAKACgAoA0/B/g7xN4/wDEtj4M8F6Feapq+qXkVppel6fatNcXc8jBUijRAWd2YgBQMkmgD+mH/ggJ/wAG/wD4c/Yj0Gx/ak/ag0m01P4s6hak2dodssHhaJ1w1vbsMh7kqSs1yvC8xRHG93AP1mtbH5Ut4owoVAFVFCqqjoAB0AoA5D9pH9mD4O/tWfCDWfgZ8dvB9vrvhrXbQw3dnOg3I+CFmjY8pKuSVYepByCQQD+T/wD4LTf8EWPjD/wS3+ML3MEV1rXwz1u5dvCnitYDtC5/49p+0cqDAIPXtkEEgHwpQAUAFABQAUAFABQBv6J4t0/w3F59r4Zs7y+LcXGpxCaOEf7ER+Qn/acN7AdaAPs7/gnN+z58e/jjr9r8RfG/jPXrHw3bup07TLG8e0iumH8Xlw7FEY+mDQB+q3wz/YG+HX7QcFvo/wAVvhZoevWGApTV9Fgmdx0J3sm9fqGB96AOc/at/wCDRn4F/F7wZc+Mf2QfiHc/D7xQsRePQtXMl7o16/J2gnM9rk4G5WkUf3MUAfh/+2N+wl+09+wV8U5vhD+098Mb3w9qaljZXLDzbPUYgcCa2uF+SZD7HI/iCnigDx+gAoAKACgAoAKACgC94c8N614s1m28O+HdMnvb+8nSG0tLaIvJNIxwqqo6kmgD9Ff+CL37V/7Hn/BPv9qZLf4l+DfD/iLxtfwxW1j8Rtb1QrpGg3Jk2z6ZFIuRAs8ZMLat8yxSYG02zSykA/qH+DXxk8DfGvwJD40+H9xILdZGtLvTrqERXWlXMYHmWdzECfKmjyuVBKsrI6M8bo7AHdaa8giZnwAwyoA5z9aAJ3fPODn0J4oA4D9pX9nL4O/tX/B7WPgb8cvB1prnhzXLZob2yuEG5SQQssbEfu5FySrjp0OQSCAfyhf8Fo/+CJHxr/4Jc/FybUdOs7rX/hbrFw8nhjxfFbkrGhORbXGP9XKgwCD1HIyOaAPhCgAoAKACgAoAKAPqD/gnh+wV4i/aa8aQeKvE+mTR+GLKdSxZdv21wfuKT/D6n60AfuF+zH+y7pemWth4Z8P6MkVrCqIfKiCqwX+BcdFoA/Qz4B/Aux8M2MVzPaABVGSUoA9hjhSErBAoWNRgYHWgDxz9uT9hP9nn/goF8ENR+B/7QHg+C/tLmNjpupCBTdaXcY+S4gfqrKe2Rkce9AH8nP8AwVM/4Ja/Hj/gmR8ebj4Z/E3T5bzQbyR5vC3imCEm21S2ydrBugcAYZTggggjPFAHyzQAUAFABQAUAW9E0TUvEOow6Ro9nLcXVxKscFvChZpGPQAUAdle+LLP4W6Tc+FfBN3HPq99A1vrniC3kztiYYe0tXHSM9JJhzKMopEefMAOCyc5zQB+p3/BDj/guP42/Ze8b6R8FvjP4tiOleTBpmia1rd8Y7Se0QkRaTqUxz5UKZItL8gtZM3lyb7R2WEA/po+CHxp8B/HLwJB438BXM/2czPbX9jfRCO80y8QDzbS6iyfKmTcMjJVlZHRnjdHYA66adUG3PPtQBXlllkkETg+vpxQBzvxa+Evwz+O3w/1P4UfGPwRpviPw7q8Pk6jpOrW4khlTscHlWHUOpDKeQRQB+Ef/BTD/g0U8R22p6h8UP8Agm94wiu7Ry8zfDzxNdKksWTnZa3X3XHYLJg+560Afjl+0F+xZ+1V+yr4km8KftDfAXxT4UvIWIb+1NIkWJwD95JQDG49wxoA8vEchfywh3HouOaAOg8NfC/xv4uvYrDQtAuJZJwTCXTy1YAbmOXIAVQCWb7qgEkgAmgL2P0U/YJ/4Nmv2wf2u/Dtp8RNZ0o6H4ZvI1kg17Wrg6bZXCHndbs8MtzdqR0kjtxC38EzDmqjHmMJ4inCnzvY+0bX/g1A+Cfg3ToY/GHxR0jU7tEHnRWyamqs3ceZ9qX/ANFj6V61DKalSnzzlY/L+JvFHB5JV5KVNT/7e/4B9T+Af2Ff2ffgb8PNL8J+E7SfQbnT7dYZBZ5vrN1UdQG8uZMnr98/WuetgOT7Z8/l3jllVWpyYqlKH/kx9GfsweG/hzbPb21zqdtCWl8qK9SXfbTv2iWXA8uQ/wDPKURuewauKdOpD4j9bybiDKM7o+1wtXmPpjy4bUfYraHy0j+ULjH+TUHuCA4oAJXbb8ooA8c/bd/Yb+A37ffwG1T4BfH7w4L7T7xGbTb+OIG50q5IwtxC3YjAyuQGAweQCAD+Tf8A4Klf8Etfjz/wTH+PVz8L/ifp0t3od3I83hfxPbxE22p22Thg3QMMYKnkEEHnIoA+WqACgAoAt6Lomo+INRh0nSbSS4ubiVY4LeFNzSMewFAHT6zrWneAtOl8L+F7qO5v7mJotY1m3fK7Tw1tbt/zz7PIP9Zyq/J98A40nPWgAoAASDkUAfqj/wAEM/8Agub44/ZY8b6T8GfjN4whGlCGDTdF1vXL4x2lxaISIdJ1OU58uFNxFpfkFrJm8qTfaOywgH9L/wAGvjX4F+OHgyPxz4LuZvLSY2+pabfII7zTLoKGa1uYgT5cqhlPBKurLJGzxujsAdR532lW3D5P7x60AMkuFaMBeBkfePWgDmPiJ4+0Twboc2ratcrHDGpI5wZCO30oA/Hf/gsd/wAFRfDfgPRL+1eSK8vZI2jtLJlDrGO2QeAaAPwn1T4m/Gj4/fEaaLQ9YvBdalOxis7KcxRxrySxwQEVRksx4AHNBMpKC5pH9AP/AAQY/wCDffw38M/Cun/tT/tqeG11XU71YbzRPC2t25YzYw8Vzexyc+WrYaG1fuBNMpfy44tYwuebPEc69rL4T9YviJ8QYdNhe0tZBuAwMHpivfwGAsueR+Rcc8bU8DTnQpT948E+IHxItrUvLPcZY84yM10YrGJe5A/mjMMyqZlX5jxnxp8U7C/kkiS5BBON+7ofQ45H615Mqpz0sLUOItviNq3hXUZdV8N6m9jcyAxTONrxTqRgxSRuCkqHujgg1n8Z9FkucZlkeJ9rhavLI9x/Z/8A2/7bSLuLwn47splt7eIm406ISTy28Cglrmx6yXEKLlpLM7pokDPCZUUxJzVaSi/dP6a4J8RcPn1OOHxXuVf/AEr/AA/5H11pXiDRtd0e01/Q9Ut76yv7dLixu7OdZYrmF1DJJG6kq6MpBDAkEHIrmP1QtQtLLJxgLjPAzQBZMeyPJYEn0oA8b/bp/Ya+An/BQH4C6l8A/j34bS7s7pGfTdTjiBudLuSuBPCex4G5cgOBg4IVgAfyY/8ABUj/AIJbfHr/AIJk/Hi6+GPxS0yW50S6laTwx4mhiJttTtyTtZW6BsDBU8ggggEEUAfLVAB9aAOtvPEml+E/DyaP4Udpb3UbQf2tquwoVRhzaw55C9pH4Ln5RhAd4ByVABQAUAFAADg5oA/Qz/gk5/wXd+Mn7DWvaZ4L+Juq6jqvhOygjsbDVreP7Ve6XZqxKWksLui6jYKSxW3d45bfcTbTw5eOQA/o/wD2Kv8Agp3+zN+2x8PrTxR4E8faOrzKqSTWV8ZrJ5SM+WJXVHt3/wCmF3HBMOyuMOQD2fxt4y0vwvpcuq6xOsNsiEqC2C5Hp60Afld/wV3/AOCrHh34K+G722h1qM6jLG62NiJwCgxwxHXPtQB/Px8SvHfxh/bH+KN5rXl3V48kvmOGc+TaoWwHkc8IuSBk4ySAASQCA56an76f8G+3/BvppHwO0PTf2tP2v/CG7Wp1ivPDXhbVrMpJGQQ8d3dxOMoAQGhtnGQQJZRv2RxaxjbY8ytP2nvT+A/Wn4gePE0+E21nIM8gYr3suwHP78z8p424yhgaboYdnhfj/wAWXBiluS5Y9+evtXbj6/s4ckD+YM6zWvj695yPkX9on4qalpc07NdyxlTw65BX2x2r5yrV1NMrwtObPna9/aSurbV/I1TUFkVuY5ScZH5VEKh9hDJvaU/cOu8P/E+x1+0BkmCqRgMRuVge2c8H/IrWEjysRl86Jp3SSaiIpbbUJo2hmSW0ubecpLBKjBkkjYEFXVgCCCGBGRTMcJiamCqe1o/GfQv7GH7Ymu/Ca9bwn43ie70SaaWfUrGxtizW5JLy6nYxIOmd0l3YoO73NsufPhblq0uU/o3gHj6nmi+p42f73/0o/QPwzq2ka5pVrr+hanb31lqECXFle2c6yw3MLqGSWN1JV0ZSGDDIIIIrE/YjRfZkbRk5wF9aAIPE+veH/AWhSeJfFFwUjjZVWOKMvLLIx2pFGg5kkdjtVRySaAP50v8Ag5L/AOC3PhT46PrH7D/wR0/RNciimNp4v8RtDDe2+lBJo5G03T5SGVrgyQx/abxDgGMQQnarySAH4sk5OTQAUAT21yFVoZk3Rt1HcH1Hv/OgBtzatbsvzBlYZRl6EUARUAFABQAUAGT60Ad1+z78S/jh8K/iDbeJ/gH8Qdf8N68GCRah4e1GW2lIyDsYxkb0OOUbKnuDQB/QP/wTj/aC/wCCpX7Xfws0j4dfGTxJ4Y1HTLKwWB9euvCwgvyuSfMaW3kjUvg4yEAOOQTk0AzvfG3/AAbG/A79p/x7N4++NPxt8R6hI7GW5NxczPBGT2VBLGB9M1XKYe1PdPgv/wAE9v8Agj//AMEm4NP8efEjxn4L8OXlgwuNI1v4meIrKz8mYcedaWjeXEknpNskm54kxWl+VGU4PEPX4T0a+/4LSf8ABL7xVf8A/CPeDv2+/hTcXMjBY0bxnbRBiewaRlU/nXfgI0HP95I+N4pqZusPKOEoymdRaeItO+Jeijxb4O8SWWsaZPzDqWj38d1buP8AZliZkP519XCeHnBRpTP5qz3Ks7nUnPEU5xMPxD4XnnjYTRblbrkVw4rBznsfn+Ny3EU/ePnr9pf4CR+ItAupRYBxsPzhNxX6jrj6civBxWHnAwweOqYCoflf+03puvfCfXZ0WV1tGlzG7PuQNnGM/wCODXkc/sz9s4bxVPMqf94p/AT9owtqQ0qfVDDK/wDyzLblPPp2+o/KuilVuenm2TXp859WeBviBBehFLhMj54mO5T+Xb37e1bxkfnONwfIz0fSJLHUPLlgmltrqGVZoLi3cxyRyqQyOjqQVYMAQwwQRWh5SniMFiIVqM7M+gv2Tv2sNX+B2oPoXiMS3nhmeWW41jSrS3LPpzMS82p2ESDLRk7pLqxQcfPc2y/66FsKtLl94/o7w88Raeb0/qGNn+9/9KPumb4geCbDwZB8R59ftrvRp7aG40+806UXC3omA8jyfLz55l3KIwmd5YYzXMftC1PwL/4OE/8Ag4F17Udb1j9j/wDZO8XGDVoxPp/jHxTpF6HTQo2Bjm0yymjOHvHUlLm7Q7Y1LW8Bx5sjAH4ZEk9aACgAoAKALNpeKimC4jLRMecdVPqPf+dADLyza1YfOGVhlHUcMP8APagCGgAoAKALOk6Te61epYafC0kkjBVVVz1oA/T/AP4I+f8ABKXX/jT4psfEviLRZPsqsrTyyIQF79ccfWgD+iv9mX9m3wx8LvCdp4N8I6VFa2ltGouJ0jwSenpyfQVoc8pc5+Xf/Bev/g5aj/Z21TUf2KP+Cb3iWyl8V6e8lr4z+JVuqXEOiyjh7OxyDHLdKeHmIZYiNqhpAWRFRhf/AAn893xK+KHxC+MXjC8+IPxT8b6v4j13UZTLqGs69qUt5dXLn+J5ZSWb86g2MHJoA9N/Zy/a/wD2m/2RfF0Xjr9mj45+JvBWpRyB2k0DVpIY58fwzQ8xTL6rIrKe4q4zcPhZlUo0a65ZxuftF/wTR/4OsfB3xIuLD4Mf8FNPCdjoOo3DJb2nxa8M2RSzdzwDqNkgPkgn708HyDOTEigtXpYPNMRQkub4T4XiXgDJ85ws5UoclXuj9WdasPDvjLw/Dr/hzVLHVNL1C0S5sNR0+6Se3vIJFyksciEq6MCCGUkEV9NVpU8fQ54H8jcU8O18uxE6VWHvRPzd/wCCo37I+oz6Nd+PvCGnl4tjG/gjXPHPzFe4+tfE43D+xqEcE8QPAY76vVPyI8Wanq3w88R+ZA7RiKYkYJVo2B/MfUVxc9j+m8BGnmGHufUH7KP7WumeIfsugeIdWVbrhY5JF2Puz0J6HPrx9K76U+c+O4h4cnD97SgfangLxjFfW6Il0HBPqAVrrhM/LcbhHCdjvbe+uJ9k9nPNBdRSo9vJAzJLHIGBV0K8hgcEEHIOKJHk0HiMLjITobnxJ/wU7/4Lean8LfhpqX7Gn7JPiO7h8Qy3t0nizxbpeqf8S/QvOUpdwaPEigWt1OS4uZo2McZaUW4iaaYjz5NOfun9l8D1s6xXD1KeZQ5J/wDpUekn2Px7dy5yf51J9cJQAUAFABQAUAXLDUI4Ue2uoi8LnJUHlD/eU9j+h6H2AG3mmPbILiGUSwMfklUYGfQj+E+x/DNAFWgCawsbjUblbW2Qs7kBQBmgD9C/+CUH/BMrxJ8ePG9hrOsaO5g3rI7unCqME9RQB/SL+x/+yd4W+Dfgqy8HeFNKS3jijU3tyI+XbHrjn2FVGKSOOc+d8kT8rv8Ag4k/4OLbPwVaa1/wT0/4J2eNAt6iy6d8R/iXo9z/AMe3VZdN0+VTzL1Wa5U/JzHGd25lJSN4wvp0P5/JJDK25s5JJJJzmpNRtABQAUAAJByDQB+k3/BEb/guN4n/AGFfENt+zr+0Xql7q3wZ1S7/AHLZaafwlPI3Nzbr1a2YnMtuPUyRjduV/WyzM3hJ8svhPz/jngnD8SYP2tJWrx2/veR+8/xA0Twh8afh1F4n8Ha3ZanpOsacl3pGradOtxb3kEi7kkjYcOjKR/8AWNe3meGp4ml7akfxLxFlOMybMJqcOScD8Vf+Ckf7J0Hh7xVf3Vn4Zjjjdm3/AGR+Cf7wU8qfavh5w5Kh+y+HnFE50IQnM+Cjfaz8OPERVbiYCKUcHKsnvVRmfvcYUMyoH2r+yL+2Rcala2XhvW5Z5ZsLDDNane7tnCjYckk9MDrnpXVSqn5bxHwxyudWJB/wUo/4Kl6l4C0e8/Zo/Z78Q7NfngNv4w8TWUo/4lakYewtXHScg4lkH+ryUT5txXSrWuuQ9ngHw6hCpDM8yhr9iH/t0j8xGct1J/E1zH7mJQAUAFABQAUAFABQBPZX0tizNFyHGGVuVYehHegCdhpV6NxzaMOuAXRj/MfrQB79+w/8OfgBr/xAtbn4wfGvwzoFokylpNYvGiQAEcnctAH7ofAL/gp1/wAEV/2F/hZbWs37XmgavdQQDzbTwhpV3qV1OwH3UEcIQEkcFnUDqSKqJzVVUl7sdj4m/wCCqn/B1l8Xv2l/Beo/s7fsE+DtR+GHgfUIJLXVvFWoXCf8JDqsDAhkQxEpYRupIby2eUg8SICQTmZrClCJ+PruXOTUmglABQAUAFABQAA4oA/Rf/gix/wWs8TfsO63b/s7/tBanean8HdUu/kbmWfwrO7fNc269Wt2JzLAPeRBuyr+tl2ZPDfup/Az8t8R/DvD8XYGVfDe7iI7P+b+6z9f/wBrX4B/D79pX4cQ+P8AwJqVhqUGoafHd6VrGnzpNbX0Ei7kdXGVdGHRvzxzU5jg017SB/HOHr5lwvnMsNWhycnxH4r/ALaP7NOo+E/FVzYvpLW9wkpjhxCeXJ4jZRk8n7pGQexNeH/cP6d4K4lpV6EPfPD9V8cXv7LGlXfhrw/qRPxBvEaK+uoJgV8LxMMPDGwODfMDh3GRbjKj96SY9oe6frdHAU8yqRr1Y/u18P8Ae/8AtTwOWVpWLuSWJJJJzmqPoErDaACgAoAKACgAoAKACgAoAKADJHQ0AKWYjBY8e9ACUAFABQAUAFABQAUAFAADz1oA/Qj/AII5/wDBY/X/ANi3WoP2fP2gL+61T4Q6rdEAkGabwxM5+a4gXq1uxOZYB7ug3ZDdWHxThD2U/hZ+Q+KPhhh+MMH9bwfuYuG3Tn/uy/8AbWeof8FpP+CjfwRt/GP/AAqv9kvW9O1zXRbq2q+PdMlWa3sEkQMsVm4yHn2tzMP9Vuwvz5KY1Y041PcPlPCXw3zXLaX13Oo8n8lL/wBul/8AIn5VTzvcOZHJLEksxbJJJ6msz+idlYZQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAZPrQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAf/Z"
            height="200"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
    </svg>
  );
};
